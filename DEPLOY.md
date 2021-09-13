# 部署文档

## 环境要求
- node: 16.2.0
- yarn: 1.22.5
- npm: 7.13.0

### 部署依赖 pm2, 安装 pm2
```
npm install -g pm2
```

### 更新配置信息 `.env.production`
```
cp .env.example .env.production
```

主网配置信息:
```
NEXT_PUBLIC_NETWORK_CHAINID=1012
NEXT_PUBLIC_API_ENDPOINT="https://graph.newtonproject.dev.diynova.com/subgraphs/name/NewtonNFT/ExchangeDev"
NEXT_PUBLIC_NEW_NFT_EXCHANGE_CONTRACT_ADDRESS="0x4B082f763844251dfae95eceF0cC4671009d37f7"
NEXT_PUBLIC_FIXED_PRICE_SALE_CONTRACT_ADDRESS="0x45d39D5E4C40f078D24ea80E2819ea53B574729f"
NEXT_PUBLIC_ENGLISH_AUCTION_CONTRACT_ADDRESS="0x0861aDFc0c90FAbb93287aEa88e7C64525f791A1"
NEXT_PUBLIC_DUTCH_AUCTION_CONTRACT_ADDRESS="0xcE8eCeBA1D21522Ffa3028270b737e10F25C644E"
NEXT_PUBLIC_DESIGNATED_SALE_CONTRACT_ADDRESS="0x535F3e39d07AC222c0Af1b742cA749e00B6C6e75"
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS="0xdECe7b73E056368F568007c75dbcA26ece919f53"
NEXT_PUBLIC_WNEW_ADDRESS="0x4438E9C8e0C9B209Fa8B76c83F73A7D317dE3c12"
NEXT_PUBLIC_OPERATION_FEE_RECEIPT_ADDRESS="NEW17zV1F558ruM22gP5fUqPfzKSddNtBso3Cii"
NEXT_PUBLIC_OPERATION_FEE=0
NEXT_PUBLIC_START_BLOCK=4716586
NEXT_PUBLIC_NFT_VIEWER_URL=https://nft.newscan.io
NEXT_PUBLIC_NEWTON_PROJECT_NFT_CONTRACT="0x0"
```

### 首次部署
> 对应脚本: ./script/deploy.sh
```shell
yarn
yarn build
pm2 start npm --name "marketplace" -- start
```

### 更新部署:
> 对应脚本: ./script/update.sh
```shell
git pull
yarn
yarn build
pm2 restart marketplace
```

### nginx 配置
```
server {
  listen 80;
  listen [::]:80;
  server_name newmall.io;
  location / {
    proxy_pass http://127.0.0.1:8900;
  }
  access_log  /var/log/nginx/newmall.io.access.log;
}
```