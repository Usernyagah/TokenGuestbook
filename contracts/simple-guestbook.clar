;; Simple Token-Gated Guestbook
;; Uses SIP-010 token as the gate for posting messages

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MAX_MESSAGE_LENGTH u280)
(define-constant MAX_MESSAGES_RETURN u50

;; Gating token contract address (configure this to your token contract)
;; Example: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZ3M.token-name
(define-constant TOKEN_CONTRACT 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZ3M.my-token)

;; Message storage
(define-data-var message-count uint u0)

;; Map of message_id -> message data
(define-map messages uint {
  author: principal,
  content: (string-utf8 280),
  timestamp: uint,
  block-height: uint
})

;; Trait for SIP-010 token
(define-trait sip-010-token
  ((get-balance (principal uint)))

;; Internal function to check if user has token access
(define-private (has-token-access (user principal))
  (>= (contract-call? TOKEN_CONTRACT get-balance user) u1)
)

;; Post a message - requires token balance ≥ 1
(define-public (post-message (content (string-utf8 280)))
  (let (
    (content-len (len content))
    (current-count (var-get message-count))
    (new-count (+ current-count u1))
  )
    ;; Validate message
    (asserts! (> content-len u0) (err u100)) ;; prevent empty messages
    (asserts! (<= content-len MAX_MESSAGE_LENGTH) (err u101)) ;; enforce max length
    
    ;; Check token access
    (asserts! (has-token-access tx-sender) (err u102)) ;; must hold ≥ 1 token
    
    ;; Store message
    (map-set messages new-count {
      author: tx-sender,
      content: content,
      timestamp: (get-block-info? time block-height),
      block-height: block-height
    })
    
    ;; Update message count
    (var-set message-count new-count)
    
    (ok new-count)
  )
)

;; Get the latest messages (up to limit)
(define-read-only (get-messages (limit uint))
  (let (
    (total-count (var-get message-count))
    (adjusted-limit (if (> limit MAX_MESSAGES_RETURN) MAX_MESSAGES_RETURN limit))
    (start-id (if (> total-count adjusted-limit) 
                  (- total-count adjusted-limit) 
                  u0))
  )
    (get-message-range start-id total-count)
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

;; Get a specific message by ID
(define-read-only (get-message (message-id uint))
  (match (map-get? messages message-id)
    message (ok message)
    (err u200)
  )
)

;; Check if a user can post (read-only helper)
(define-read-only (can-post (user principal))
  (has-token-access user)
)
