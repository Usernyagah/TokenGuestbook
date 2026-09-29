;; Guestbook Contract - Token-Gated Message Board
;; Users can only post if they hold ≥ 1 GUEST token or own at least 1 Guestbook NFT

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MAX_MESSAGE_LENGTH u280)
(define-constant RATE_LIMIT_BLOCKS u12) ;; ~12 blocks (~1 minute on Stacks)
(define-constant MAX_MESSAGES_PER_READ u50)

;; Token and NFT contract addresses (to be set by owner)
(define-data-var token-contract (optional principal) none)
(define-data-var nft-contract (optional principal) none)

;; Message data structure
(define-data-var message-count uint u0)

;; Messages stored as a list of tuples
;; Using maps for efficient lookup by ID
(define-map messages uint {author: principal, content: (string-utf8 280), timestamp: uint, block-height: uint})

;; Track last post block height per user for rate limiting
(define-map last-post-block principal uint)

;; Trait for SIP-010 token (gating token)
(define-trait sip-010-token
  ((get-balance (principal uint))))

;; Trait for SIP-009 NFT (alternative gating)
(define-trait sip-009-nft
  ((has-access (principal bool))))

;; Set the token contract address (only owner)
(define-public (set-token-contract (contract principal))
  (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u100))
  (var-set token-contract (some contract))
  (ok true)
)

;; Set the NFT contract address (only owner)
(define-public (set-nft-contract (contract principal))
  (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u101))
  (var-set nft-contract (some contract))
  (ok true)
)

;; Internal function to check if user has token access
(define-private (has-token-access (user principal))
  (match (var-get token-contract)
    contract
      (contract-call? contract get-balance user)
    false
  )
)

;; Internal function to check if user has NFT access
(define-private (has-nft-access (user principal))
  (match (var-get nft-contract)
    contract
      (contract-call? contract has-access user)
    false
  )
)

;; Internal function to check if user has any access
(define-private (has-access (user principal))
  (or (has-token-access user) (has-nft-access user))
)

;; Check rate limit for a user
(define-private (check-rate-limit (user principal))
  (match (map-get? last-post-block user)
    last-block
      (let (
        (current-block block-height)
        (blocks-since (- current-block last-block))
      )
        (>= blocks-since RATE_LIMIT_BLOCKS)
      )
    true ;; First post, no rate limit
  )
)

;; Post a message (requires token or NFT access)
(define-public (post-message (content (string-utf8 280)))
  (let (
    (content-len (len content))
    (current-count (var-get message-count))
    (new-count (+ current-count u1))
  )
    ;; Validate message
    (asserts! (> content-len u0) (err u200)) ;; prevent empty messages
    (asserts! (<= content-len MAX_MESSAGE_LENGTH) (err u201)) ;; enforce max length
    
    ;; Check access
    (asserts! (has-access tx-sender) (err u202)) ;; must hold token or NFT
    
    ;; Check rate limit
    (asserts! (check-rate-limit tx-sender) (err u203)) ;; rate limited
    
    ;; Store message
    (map-set messages new-count {author: tx-sender, content: content, timestamp: (get-block-info? time block-height), block-height: block-height})
    
    ;; Update rate limit tracking
    (map-set last-post-block tx-sender block-height)
    
    ;; Update message count
    (var-set message-count new-count)
    
    (ok new-count)
  )
)

;; Get a specific message by ID
(define-read-only (get-message (message-id uint))
  (match (map-get? messages message-id)
    message (ok message)
    (err u300)
  )
)

;; Get the latest N messages
(define-read-only (get-latest-messages (count uint))
  (let (
    (total-count (var-get message-count))
    (adjusted-count (if (> count MAX_MESSAGES_PER_READ) MAX_MESSAGES_PER_READ count))
    (start-id (if (> total-count adjusted-count) 
                  (- total-count adjusted-count) 
                  u0))
  )
    (get-message-range start-id total-count)
  )
)

;; Get all messages with pagination
(define-read-only (get-messages-paginated (offset uint) (limit uint))
  (let (
    (total-count (var-get message-count))
    (adjusted-limit (if (> limit MAX_MESSAGES_PER_READ) MAX_MESSAGES_PER_READ limit))
    (start-id (if (> total-count adjusted-limit)
                  (- total-count offset adjusted-limit)
                  u0))
    (end-id (if (> total-count offset)
                (- total-count offset)
                total-count))
  )
    (get-message-range start-id end-id)
  )
)

;; Internal function to get a range of messages
(define-private (get-message-range (start-id uint) (end-id uint))
  (if (>= start-id end-id)
    (list {author: tx-sender, content: "", timestamp: u0, block-height: u0})
    (let (
      (message (unwrap! (map-get? messages start-id) (list {author: tx-sender, content: "", timestamp: u0, block-height: u0})))
      (rest (get-message-range (+ start-id u1) end-id))
    )
      (append message rest)
    )
  )
)

;; Get total message count
(define-read-only (get-message-count)
  (var-get message-count)
)

;; Check if a user can post (read-only helper)
(define-read-only (can-post (user principal))
  (and (has-access user) (check-rate-limit user))
)

;; Get messages by a specific author
(define-read-only (get-messages-by-author (author principal) (limit uint))
  (let (
    (total-count (var-get message-count))
    (adjusted-limit (if (> limit MAX_MESSAGES_PER_READ) MAX_MESSAGES_PER_READ limit))
  )
    (filter-by-author-helper (list {author: tx-sender, content: "", timestamp: u0, block-height: u0}) total-count author adjusted-limit)
  )
)

;; Helper to filter messages by author
(define-private (filter-by-author-helper (acc (list 50 {author: principal, content: (string-utf8 280), timestamp: uint, block-height: uint})) (current-id uint) (target-author principal) (remaining uint))
  (if (or (is-eq current-id u0) (is-eq remaining u0))
    acc
    (let (
      (message (unwrap! (map-get? messages current-id) acc))
      (message-author (get author message))
    )
      (if (is-eq message-author target-author)
        (filter-by-author-helper (append message acc) (- current-id u1) target-author (- remaining u1))
        (filter-by-author-helper acc (- current-id u1) target-author remaining)
      )
    )
  )
)

;; Get rate limit info for a user
(define-read-only (get-rate-limit-info (user principal))
  (match (map-get? last-post-block user)
    last-block
      (let (
        (current-block block-height)
        (blocks-since (- current-block last-block))
        (can-post-now (>= blocks-since RATE_LIMIT_BLOCKS))
        (blocks-remaining (if can-post-now u0 (- RATE_LIMIT_BLOCKS blocks-since)))
      )
        {can-post: can-post-now, blocks-remaining: blocks-remaining}
      )
    {can-post: true, blocks-remaining: u0} ;; No posts yet
  )
)
