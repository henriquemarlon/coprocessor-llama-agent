# LOADING ENV FILE
-include .env

START_LOG = @echo "==================== START OF LOG ===================="
END_LOG = @echo "==================== END OF LOG ======================"

define deploy_chat
	$(START_LOG)
	@forge test
	@forge script script/DeployLlamaAgent.s.sol --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vvv
	$(END_LOG)
endef

.PHONY: setup
setup: .env.tmpl
	forge install
	cp .env.tmpl .env

.PHONY: chat
chat:
	@echo "Deploying chat..."
	@$(deploy_chat)