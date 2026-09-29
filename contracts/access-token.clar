;; Access Token - Simple SIP-010 Fungible Token
;; Used as the gate for the guestbook

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant TOKEN_NAME "Access Token")
(define-constant TOKEN_SYMBOL "ACCESS")
(define-constant TOKEN_DECIMALS u0)
(define-constant TOTAL_SUPPLY u1000000)

;; Data maps
(define-data-var total-supply uint TOTAL_SUPPLY)

;; Token balances
(define-fungible-token access-token)

;; Initial mint to contract owner
(ft-mint? access-token TOTAL_SUPPLY CONTRACT_OWNER)

;; Read-only function to get token name
(define-read-only (get-name)
  (ok TOKEN_NAME))

;; Read-only function to get token symbol
(define-read-only (get-symbol)
  (ok TOKEN_SYMBOL))

;; Read-only function to get token decimals
(define-read-only (get-decimals)
  (ok TOKEN_DECIMALS))

;; Read-only function to get total supply
(define-read-only (get-total-supply)
  (ok (var-get total-supply)))

;; Read-only function to get balance
(define-read-only (get-balance (account principal))
  (ok (ft-get-balance access-token account)))

;; Transfer function
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 256))))
  (begin
    (asserts! (is-eq tx-sender sender) (err u100))
    (asserts! (<= amount (ft-get-balance access-token sender)) (err u101))
    (asserts! (> amount u0) (err u102))
    (match memo m (begin (print m) true) true)
    (ft-transfer? access-token amount sender recipient)
  )
)

;; Mint function (only owner)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u200))
    (asserts! (> amount u0) (err u201))
    (var-set total-supply (+ (var-get total-supply) amount))
    (ft-mint? access-token amount recipient)
  )
)

;; Burn function
(define-public (burn (amount uint))
  (begin
    (asserts! (<= amount (ft-get-balance access-token tx-sender)) (err u300))
    (asserts! (> amount u0) (err u301))
    (var-set total-supply (- (var-get total-supply) amount))
    (ft-burn? access-token amount tx-sender)
  )
)
