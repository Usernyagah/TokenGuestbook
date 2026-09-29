;; Guestbook NFT - SIP-009 Non-Fungible Token
;; This NFT serves as an alternative gate for accessing the guestbook

;; Trait for SIP-009 compliance
(define-trait sip-009-nft
  ((get-last-token-id (uint))
   (get-owner (uint (response principal uint)))
   (get-token-uri (uint (response (string-utf8 256) uint))))

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant NFT_NAME "Guestbook Access NFT")
(define-constant NFT_URI "ipfs://QmExampleNFT")
(define-constant MAX_SUPPLY u1000)

;; Data maps
(define-data-var last-token-id uint u0)
(define-data-var total-supply uint u0)

;; NFT ownership map
(define-non-fungible-token guestbook-nft uint)

;; Mint function (only owner)
(define-public (mint (recipient principal))
  (let (
    (current-id (var-get last-token-id))
    (current-supply (var-get total-supply))
    (new-id (+ current-id u1))
  )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u100)) ;; only owner
    (asserts! (< current-supply MAX_SUPPLY) (err u101)) ;; max supply reached
    
    (var-set last-token-id new-id)
    (var-set total-supply (+ current-supply u1))
    (nft-mint? guestbook-nft new-id recipient)
    (ok new-id)
  )
)

;; Transfer function
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (let (
    (owner (nft-get-owner? guestbook-nft token-id))
  )
    (asserts! (is-some owner) (err u200)) ;; token doesn't exist
    (asserts! (is-eq (unwrap-iso owner) sender) (err u201)) ;; sender is not owner
    (asserts! (is-eq tx-sender sender) (err u202)) ;; tx-sender must be owner
    
    (nft-transfer? guestbook-nft token-id sender recipient)
    (ok true)
  )
)

;; Burn function
(define-public (burn (token-id uint))
  (let (
    (owner (nft-get-owner? guestbook-nft token-id))
    (current-supply (var-get total-supply))
  )
    (asserts! (is-some owner) (err u300)) ;; token doesn't exist
    (asserts! (is-eq (unwrap-iso owner) tx-sender) (err u301)) ;; tx-sender must be owner
    
    (var-set total-supply (- current-supply u1))
    (nft-burn? guestbook-nft token-id tx-sender)
    (ok true)
  )
)

;; Read-only function to get last token ID
(define-read-only (get-last-token-id)
  (var-get last-token-id)
)

;; Read-only function to get owner of a token
(define-read-only (get-owner (token-id uint))
  (match (nft-get-owner? guestbook-nft token-id)
    owner (ok owner)
    (err u401)
  )
)

;; Read-only function to get token URI
(define-read-only (get-token-uri (token-id uint))
  (ok NFT_URI)
)

;; Read-only function to get NFT name
(define-read-only (get-name)
  NFT_NAME
)

;; Read-only function to get total supply
(define-read-only (get-total-supply)
  (var-get total-supply)
)

;; Check if an account owns at least 1 NFT (simplified version - checks by iteration)
(define-read-only (has-access (account principal))
  (let (
    (last-id (var-get last-token-id))
  )
    (if (is-eq last-id u0)
      false
      (has-access-helper u1 last-id account)
    )
  )
)

;; Helper function to check if account owns any NFT (iterates through all NFTs)
(define-private (has-access-helper (current-id uint) (last-id uint) (account principal))
  (if (> current-id last-id)
    false
    (match (nft-get-owner? guestbook-nft current-id)
      owner
        (if (is-eq (unwrap-iso owner) account)
          true
          (has-access-helper (+ current-id u1) last-id account)
        )
      (has-access-helper (+ current-id u1) last-id account)
    )
  )
)

;; Get all NFT IDs owned by an account
(define-read-only (get-owned-nfts (account principal))
  (let (
    (last-id (var-get last-token-id))
  )
    (get-owned-nfts-helper (list u0) u1 last-id account)
  )
)

;; Helper function to build list of owned NFTs
(define-private (get-owned-nfts-helper (acc (list 100 uint)) (current-id uint) (last-id uint) (account principal))
  (if (> current-id last-id)
    acc
    (match (nft-get-owner? guestbook-nft current-id)
      owner
        (if (is-eq (unwrap-iso owner) account)
          (get-owned-nfts-helper (append acc current-id) (+ current-id u1) last-id account)
          (get-owned-nfts-helper acc (+ current-id u1) last-id account)
        )
      (get-owned-nfts-helper acc (+ current-id u1) last-id account)
    )
  )
)
