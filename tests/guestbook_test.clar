;; Token-Gated Guestbook Clarinet Tests

;; Test 1: Check initial token supply
(asserts! (is-eq (contract-call? 'access-token get-total-supply) u1000000) true)

;; Test 2: Check deployer balance
(asserts! (is-eq (contract-call? 'access-token get-balance tx-sender) u1000000) true)

;; Test 3: Set token contract in guestbook
(asserts! (is-ok (contract-call? 'guestbook-v2 set-token-contract 'access-token)) true)

;; Test 4: Successful post when holding token (deployer has tokens)
(asserts! (is-ok (contract-call? 'guestbook-v2 post-message "Hello from token holder!")) true)

;; Test 5: Check message count is 1
(asserts! (is-eq (contract-call? 'guestbook-v2 get-message-count) u1) true)

;; Test 6: Empty message rejection
(asserts! (is-err (contract-call? 'guestbook-v2 post-message "")) true)

;; Test 7: Message too long rejection
(asserts! (is-err (contract-call? 'guestbook-v2 post-message "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")) true)

;; Test 8: Read messages
(asserts! (is-ok (contract-call? 'guestbook-v2 get-messages u10)) true)

;; Test 9: Can-post check for token holder (deployer)
(asserts! (is-eq (contract-call? 'guestbook-v2 can-post tx-sender) true) true)

;; Test 10: Post second message
(asserts! (is-ok (contract-call? 'guestbook-v2 post-message "Second message!")) true)

;; Test 11: Check message count is 2
(asserts! (is-eq (contract-call? 'guestbook-v2 get-message-count) u2) true)

;; Test 12: Get latest messages with limit
(asserts! (is-ok (contract-call? 'guestbook-v2 get-messages u1)) true)

;; Test 13: Get specific message by ID
(asserts! (is-ok (contract-call? 'guestbook-v2 get-message u1)) true)

;; Test 14: Burn all tokens from deployer
(asserts! (is-ok (contract-call? 'access-token burn u1000000)) true)

;; Test 15: Deployer now has 0 tokens
(asserts! (is-eq (contract-call? 'access-token get-balance tx-sender) u0) true)

;; Test 16: Deployer can no longer post
(asserts! (is-eq (contract-call? 'guestbook-v2 can-post tx-sender) false) true)

;; Test 17: Failed post when not holding token
(asserts! (is-err (contract-call? 'guestbook-v2 post-message "Should fail without token!")) true)

;; Test 18: Mint token back to deployer
(asserts! (is-ok (contract-call? 'access-token mint u1 tx-sender)) true)

;; Test 19: Deployer can post again
(asserts! (is-ok (contract-call? 'guestbook-v2 post-message "Back with a token!")) true)

;; Test 20: Check message count is 3
(asserts! (is-eq (contract-call? 'guestbook-v2 get-message-count) u3) true)

(print "All tests passed!")
