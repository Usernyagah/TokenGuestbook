;; Guestbook Token - SIP-010 Fungible Token
;; This token serves as the gate for accessing the guestbook

;; Trait for SIP-010 compliance
(define-trait sip-010-token
  ((transfer (principal principal uint (response bool uint)) (commit-bool))
   (get-name (string-utf8))
   (get-symbol (string-utf8))
   (get-decimals (uint))
   (get-balance (principal uint))
   (get-total-supply (uint)))

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant TOKEN_NAME "Guestbook Access Token")
(define-constant TOKEN_SYMBOL "GUEST")
(define-constant TOKEN_DECIMALS u0)
(define-constant TOTAL_SUPPLY u1000000)

;; Data maps
(define-data-var total-supply uint TOTAL_SUPPLY)
(define-data-var token-uri (optional (string-utf8 256)) (some "ipfs://QmExample"))

;; Token balances
(define-fungible-token guestbook-token uint)

;; Initial mint to contract owner
(mint? guestbook-token TOTAL_SUPPLY CONTRACT_OWNER)

;; Internal function to get token name
(define-read-only (get-name)
  TOKEN_NAME)

;; Internal function to get token symbol
(define-read-only (get-symbol)
  TOKEN_SYMBOL)

;; Internal function to get token decimals
(define-read-only (get-decimals)
  TOKEN_DECIMALS)

;; Internal function to get total supply
(define-read-only (get-total-supply)
  (var-get total-supply))

;; Read-only function to get balance
(define-read-only (get-balance (account principal))
  (ft-get-balance guestbook-token account))

;; Read-only function to get token URI
(define-read-only (get-token-uri)
  (var-get token-uri))

;; Transfer function
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 256))))
  (let (
    (sender-balance (ft-get-balance guestbook-token sender))
  )
    (asserts! (is-eq tx-sender sender) (err u100)) ;; sender must be tx-sender
    (asserts! (<= amount sender-balance) (err u101)) ;; insufficient balance
    (asserts! (> amount u0) (err u102)) ;; amount must be > 0
    
    (ft-transfer? guestbook-token amount sender recipient)
    (ok true)
  )
)

;; Mint function (only owner)
(define-public (mint (amount uint) (recipient principal))
  (let (
    (current-supply (var-get total-supply))
  )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u200)) ;; only owner
    (asserts! (> amount u0) (err u201)) ;; amount must be > 0
    
    (var-set total-supply (+ current-supply amount))
    (ft-mint? guestbook-token amount recipient)
    (ok true)
  )
)

;; Burn function
(define-public (burn (amount uint))
  (let (
    (sender-balance (ft-get-balance guestbook-token tx-sender))
    (current-supply (var-get total-supply))
  )
    (asserts! (<= amount sender-balance) (err u300)) ;; insufficient balance
    (asserts! (> amount u0) (err u301)) ;; amount must be > 0
    
    (var-set total-supply (- current-supply amount))
    (ft-burn? guestbook-token amount tx-sender)
    (ok true)
  )
)

;; Check if an account has at least 1 token
(define-read-only (has-access (account principal))
  (>= (ft-get-balance guestbook-token account) u1)
)
