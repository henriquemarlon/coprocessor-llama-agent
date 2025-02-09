cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 \
--volume=.:/mnt --env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 --env=LLAMA_LOCAL_URL=http://10.0.2.2:8080 --workdir=/opt/cartesi/dapp -- /usr/local/bin/startup.sh

0x68B1D87F95878fE05B998F19b66F4baba5De1aed
