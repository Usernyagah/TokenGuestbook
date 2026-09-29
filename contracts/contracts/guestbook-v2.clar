;; Token-Gated Guestbook
;; Uses SIP-010 token as the gate for posting messages

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MAX_MESSAGE_LENGTH u280)

;; Message storage
(define-data-var message-count uint u0)

;; Map of message_id -> message data
(define-map messages uint {
  author: principal,
  content: (string-utf8 280),
  timestamp: uint,
  block-height: uint
})

;; Post a message - requires token balance >= 1
(define-public (post-message (content (string-utf8 280)))
  (let (
    (content-len (len content))
    (current-count (var-get message-count))
    (new-count (+ current-count u1))
    (balance (unwrap! (contract-call? .access-token get-balance tx-sender) (err u202)))
  )
    ;; Validate message
    (asserts! (> content-len u0) (err u200))
    (asserts! (<= content-len MAX_MESSAGE_LENGTH) (err u201))
    
    ;; Check token access (must hold >= 1 token)
    (asserts! (>= balance u1) (err u202))
    
    ;; Store message
    (map-set messages new-count {
      author: tx-sender,
      content: content,
      timestamp: (default-to u0 (get-block-info? time (- block-height u1))),
      block-height: block-height
    })
    
    ;; Update message count
    (var-set message-count new-count)
    
    (ok new-count)
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
    (err u300)
  )
)

;; Check if a user can post (read-only helper)
(define-read-only (can-post (user principal))
  (>= (unwrap-panic (contract-call? .access-token get-balance user)) u1)
)
