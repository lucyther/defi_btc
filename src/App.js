import React from 'react';
import Button from 'react-bootstrap-button-loader';
import {Navbar, Modal, Image} from 'react-bootstrap';
import QRCode from 'qrcode.react';
import {pBTC} from 'ptokens-pbtc';
import AToken from "./AToken.json";
import WETH from "./WETH.json";
import UniswapV2Factory from "./UniswapV2Factory.json";
import UniswapV2Pair from "./UniswapV2Pair.json";
import LendingPool from "./LendingPool.json";
import LendingPoolAddressProvider from "./LendingPoolAddressProvider.json";
import ERC20ABI from "./ERC20.json";
import Sablier from "./Sablier";
import Datetime from 'react-datetime';
import moment from 'moment';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import Portis from "@portis/web3";


const pBTCAddress = '0xeb770b1883dcce11781649e8c4f1ac5f4b40c978';
const uniswapV2FactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const lendingPoolAddressProviderAddress = '0x1c8756FD2B28e9426CDBDcC7E3c4d64fa9A54728';
const WETHAddress = '0xc778417e063141139fce010982780140aa0cd5ab';
const sablierAddress = '0xc04Ad234E01327b24a831e3718DBFcbE245904CC';

const depositTokenMapping = {
    "ETH": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    "DAI": "0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108",
    "USDC": "0x851dEf71f0e6A903375C1e536Bd9ff1684BAD802",
    "SUSD": "0xc374eB17f665914c714Ac4cdC8AF3a3474228cc5",
    "TUSD": "0xa51EE1845C13Cb03FcA998304b00EcC407fc1F92",
    "USDT": "0xB404c51BBC10dcBE948077F18a4B8E553D160084",
    "BUSD": "0xFA6adcFf6A90c11f31Bc9bb59eC0a6efB38381C6",
    "BAT": "0x85B24b3517E3aC7bf72a14516160541A60cFF19d",
    "KNC": "0xCe4aA1dE3091033Ba74FA2Ad951f6adc5E5cF361",
    "LEND": "0x217b896620AfF6518B9862160606695607A63442",
    "LINK": "0x1a906E71FF9e28d8E01460639EB8CF0a6f0e2486",
    "MANA": "0x78b1F763857C8645E46eAdD9540882905ff32Db7",
    "MKR": "0x2eA9df3bABe04451c9C3B06a2c844587c59d9C37",
    "REP": "0xBeb13523503d35F9b3708ca577CdCCAdbFB236bD",
    "WBTC": "0xa0E54Ab6AA5f0bf1D62EC3526436F3c05b3348A0",
    "ZRX": "0x02d7055704EfF050323A2E5ee4ba05DB2A588959",
};

const redeemaTokenMapping = {
    "aETH": "0x2433A1b6FcF156956599280C3Eb1863247CFE675",
    "aDAI": "0xcB1Fe6F440c49E9290c3eb7f158534c2dC374201",
    "aUSDC": "0x2dB6a31f973Ec26F5e17895f0741BB5965d5Ae15",
    "aSUSD": "0x5D17e0ea2d886F865E40176D71dbc0b59a54d8c1",
    "aTUSD": "0x82F01c5694f36690a985F01dC0aD46e1B20E7a1a",
    "aUSDT": "0x790744bC4257B4a0519a3C5649Ac1d16DDaFAE0D",
    "aBUSD": "0x81E065164bAC7203c3bFEB1a749F48a64383c6eE",
    "aBAT": "0x0D0Ff1C81F2Fbc8cbafA8Df4bF668f5ba963Dab4",
    "aKNC": "0xCf6efd4528d27Df440fdd585a116D3c1fC5aDdEe",
    "aLEND": "0x383261d0e287f0A641322AEB15E3da50147Dd36b",
    "aLINK": "0x52fd99c15e6FFf8D4CF1B83b2263a501FDd78973",
    "aMANA": "0x8e96a4068da80F66ef1CFc7987f0F834c26106fa",
    "aMKR": "0xEd6A5d671f7c55aa029cbAEa2e5E9A18E9d6a1CE",
    "aREP": "0xE4B92BcDB2f972e1ccc069D4dB33d5f6363738dE",
    "aWBTC": "0xA1c4dB01F8344eCb11219714706C82f0c0c64841",
    "aZRX": "0x5BDC773c9D3515a5e3Dd415428F92a90E8e63Ae4",
};

class App extends React.Component {
    state = {
        account: '',
        pBTCAccount: '',
        tokenBalances: {
        },
        showTokenBalanceModal: false,
        loadingRedeem: false,
        loadingIssue: false,
        pBTCRedeemAmount: '',
        BTCAddress: '',
        web3: '',
        BTCRedeemAddress: '',
        tokenSwapFrom: pBTCAddress,
        tokenSwapFromAmount: '',
        tokenSwapTo: depositTokenMapping['WBTC'],
        tokenSwapToAmount: '',
        loadingSwap: false,
        tokenDepositAddress: depositTokenMapping['WBTC'],
        tokenDepositAmount: '',
        aTokenRedeemAddress: redeemaTokenMapping['aWBTC'],
        aTokenRedeemAmount: '',
        loadingTokenDeposit: false,
        loadingaTokenRedeem: false,
        loadingCreateStream: false,
        loadingWithdrawStream: false,
        streamToken: pBTCAddress,
        streamAmount: '',
        streamRecipient: '',
        streamStartTime: moment().add(10, 'minutes'),
        streamStopTime: moment().add(70, 'minutes'),
        streamId: '',
        streamWithdrawAmount: '',
        withdrawStreamId: ''
    };

    web3Modal = new Web3Modal({
        network: "ropsten", // optional
        cacheProvider: true, // optional
        providerOptions: {
            portis: {
                package: Portis, // required
                options: {
                    id: "8ec2675d-95be-4b16-85ea-88cbe9345e94" // required
                }
            }
        }
    });

    getpBTCObj() {
        const pbtc = new pBTC({
            ethProvider: this.state.web3,
            btcNetwork: 'testnet'
        });
        return pbtc
    }

    async login(){
        const provider = await this.web3Modal.connect();
        await this.subscribeProvider(provider);
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        const networkId = await web3.eth.net.getId();
        if(networkId !== 3){
            alert('App works only for Ropsten testnet and BTC testnet');
            return;
        }
        this.setState({
            web3: web3,
            account: address,
            pBTCAccount: address
        });
        await this.updateTokenBalances();
    }

    async logout(){
        this.resetApp();
    }

    async subscribeProvider(provider){
        if (!provider.on) {
            return;
        }
        provider.on("close", () => this.resetApp());
        provider.on("accountsChanged", async (accounts) => {
            await this.setState({account: accounts[0], pBTCAccount: accounts[0]});
            await this.updateTokenBalances();
        });
        provider.on("chainChanged", async (chainId) => {
            const {web3} = this.state;
            const networkId = await web3.eth.net.getId();
            if (networkId !== 3) {
                alert('App works only for Ropsten testnet and BTC testnet');
                return;
            }
            await this.updateTokenBalances();
        });

        provider.on("networkChanged", async (networkId) => {
            if (networkId !== 3) {
                alert('App works only for Ropsten testnet and BTC testnet');
                return;
            }
            await this.updateTokenBalances();
        });
    };

    async resetApp(){
        const {web3} = this.state;
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
            await web3.currentProvider.close();
        }
        await this.web3Modal.clearCachedProvider();
        this.setState({account: '', web3: '',  pBTCAccount: ''});
    };

    async updateTokenBalances(){
        let tokenBalances = this.state.tokenBalances;
        let tokenMapping = Object.assign({}, depositTokenMapping, redeemaTokenMapping);
        tokenMapping['pBTC'] = pBTCAddress;
        await Object.keys(tokenMapping).map(async (key, index) => {
            if(key === 'ETH'){
                let balance = await this.state.web3.eth.getBalance(this.state.account);
                balance = this.state.web3.utils.fromWei(balance);
                tokenBalances[key] = balance.toString();
                return
            }
            let address = tokenMapping[key];
            let contract = new this.state.web3.eth.Contract(ERC20ABI, address);
            let decimals = await contract.methods.decimals().call();
            let balance = await contract.methods.balanceOf(this.state.account).call();
            if(decimals === '6'){
                balance = this.state.web3.utils.fromWei(balance, "mwei");
            }
            else{
                balance = this.state.web3.utils.fromWei(balance);
            }
            tokenBalances[key] = balance.toString();
            this.setState({tokenBalances: tokenBalances});
        });
    }

    openTokenBalanceModal(){
        this.setState({showTokenBalanceModal: true})
    }

    closeTokenBalanceModal(){
        this.setState({showTokenBalanceModal: false})
    }

    updateIssuepBTCAddress(value) {
        this.setState({pBTCAccount: value})
    }

    updatepBTCRedeemAmount(value) {
        if(value === ''){
            this.setState({pBTCRedeemAmount: value});
            return
        }
        let valid = value.match(/^[+]?(?=.?\d)\d*(\.\d{0,18})?$/);
        if(!valid){
            return
        }
        this.setState({pBTCRedeemAmount: value})
    }

    updatepBTCRedeemAddress(value) {
        this.setState({BTCRedeemAddress: value})
    }

    async generateBTCPayAddress() {
        this.setState({loadingIssue: true});
        const pbtc = this.getpBTCObj();
        const depositAddress = await pbtc.getDepositAddress(this.state.pBTCAccount);
        this.setState({BTCAddress: depositAddress.toString()});
        await depositAddress.waitForDeposit()
            .once('onBtcTxBroadcasted', tx => {
                console.log('onBtcTxBroadcasted')
            })
            .once('onBtcTxConfirmed', tx => {
                console.log('onBtcTxConfirmed')
            })
            .once('onNodeReceivedTx', report => {
                console.log('onNodeReceivedTx')
            })
            .once('onNodeBroadcastedTx', report => {
                console.log('onNodeBroadcastedTx')
            })
            .once('onEthTxConfirmed', tx => {
                console.log('onEthTxConfirmed')
            })
            .then(async res => {
                this.setState({loadingIssue: false});
                await this.updateTokenBalances();
            });

    }

    async redeempBTC() {
        this.setState({loadingRedeem: true});
        const pbtc = this.getpBTCObj();
        pbtc.redeem(this.state.pBTCRedeemAmount, this.state.BTCRedeemAddress)
            .once('onEthTxConfirmed', tx => {
                console.log('onEthTxConfirmed')
            })
            .once('onNodeReceivedTx', report => {
                console.log('onNodeReceivedTx')
            })
            .once('onNodeBroadcastedTx', report => {
                console.log('onNodeBroadcastedTx')
            })
            .once('onBtcTxConfirmed', tx => {
                console.log('onBtcTxConfirmed')
            })
            .then(async res => {
                this.setState({loadingRedeem: false});
                await this.updateTokenBalances();
            });
        this.setState({loadingRedeem: false});
        await this.updateTokenBalances();
    }

    updateTokenSwapFrom(value){
        this.setState({tokenSwapFrom: value, tokenSwapFromAmount: '', tokenSwapToAmount: ''})
    }

    async updateTokenSwapFromAmount(value){
        if(value === ''){
            this.setState({tokenSwapFromAmount: value, tokenSwapToAmount: ''});
            return
        }
        let valid = value.match(/^[+]?(?=.?\d)\d*(\.\d{0,18})?$/);
        if(!valid){
            return
        }
        this.setState({tokenSwapFromAmount: value});
        let tokenA = this.state.tokenSwapFrom;
        let tokenB = this.state.tokenSwapTo;
        let tokenAContract = new this.state.web3.eth.Contract(ERC20ABI, tokenA);
        let tokenADecimals = await tokenAContract.methods.decimals().call();
        let tokenBContract = new this.state.web3.eth.Contract(ERC20ABI, tokenB);
        let tokenBDecimals = await tokenBContract.methods.decimals().call();
        if(tokenA.toLowerCase() === tokenB.toLowerCase()){
            return
        }
        let factoryContract = new this.state.web3.eth.Contract(UniswapV2Factory, uniswapV2FactoryAddress);
        let pairAddress = await factoryContract.methods.getPair(tokenA, tokenB).call();
        if(pairAddress === '0x0000000000000000000000000000000000000000'){
            return
        }
        let pairContract = new this.state.web3.eth.Contract(UniswapV2Pair, pairAddress);
        const token0Address = await pairContract.methods.token0().call();
        let reserves = await pairContract.methods.getReserves().call();
        let amountIn;
        try{
            if(tokenADecimals === '6') {
                amountIn = this.state.web3.utils.toWei(value, "mwei");
            }
            else{
                amountIn = this.state.web3.utils.toWei(value, "ether");
            }
        }catch(e){
            return
        }
        let amountInWithFee = this.state.web3.utils.toBN(amountIn).mul(this.state.web3.utils.toBN(997));
        let reserveIn;
        let reserveOut;
        if(tokenA.toLowerCase() === token0Address.toLowerCase()){
            reserveIn = reserves['reserve0'];
            reserveOut = reserves['reserve1'];
        }
        else{
            reserveIn = reserves['reserve1'];
            reserveOut = reserves['reserve0'];
        }
        let numerator = this.state.web3.utils.toBN(amountInWithFee).mul(this.state.web3.utils.toBN(reserveOut));
        let denominator = this.state.web3.utils.toBN(reserveIn).mul(this.state.web3.utils.toBN(1000)).add(amountInWithFee);
        let amountOut = numerator.div(denominator);
        if(tokenBDecimals === '6') {
            amountOut = this.state.web3.utils.fromWei(amountOut, "mwei").toString();
        }
        else {
            amountOut = this.state.web3.utils.fromWei(amountOut, "ether").toString();
        }
        this.setState({tokenSwapToAmount: amountOut});
    }

    updateTokenSwapTo(value){
        this.setState({tokenSwapTo: value, tokenSwapFromAmount: '', tokenSwapToAmount: ''})
    }

    updateTokenSwapToAmount(value){
        if(value === ''){
            this.setState({tokenSwapToAmount: value});
            return
        }
        let valid = value.match(/^[+]?(?=.?\d)\d*(\.\d{0,18})?$/);
        if(!valid){
            return
        }
        this.setState({tokenSwapToAmount: value})
    }

    async swap(){
        let tokenA = this.state.tokenSwapFrom;
        let tokenB = this.state.tokenSwapTo;
        if(tokenA.toLowerCase() === tokenB.toLowerCase()){
            alert('Both the tokens cannot be same');
            return
        }
        let tokenAAmount = this.state.tokenSwapFromAmount;
        let tokenBAmount = this.state.tokenSwapToAmount;
        if(tokenAAmount === '' || tokenBAmount === ''){
            alert('Amount cannot be empty');
            return
        }
        this.setState({loadingSwap: true});
        let tokenAContract = new this.state.web3.eth.Contract(ERC20ABI, tokenA);
        let tokenADecimals = await tokenAContract.methods.decimals().call();
        try {
            if (tokenADecimals === '6') {
                tokenAAmount = this.state.web3.utils.toWei(tokenAAmount, "mwei");
            } else {
                tokenAAmount = this.state.web3.utils.toWei(tokenAAmount, "ether");
            }
        }
        catch(e){
            alert('Only ' + tokenADecimals + " decimals are allowed for From token");
            this.setState({loadingSwap: false});
            return
        }
        let tokenBContract = new this.state.web3.eth.Contract(ERC20ABI, tokenB);
        let tokenBDecimals = await tokenBContract.methods.decimals().call();
        try {
            if (tokenBDecimals === '6') {
                tokenBAmount = this.state.web3.utils.toWei(tokenBAmount, "mwei");
            } else {
                tokenBAmount = this.state.web3.utils.toWei(tokenBAmount, "ether");
            }
        }
        catch(e){
            alert('Only ' + tokenBDecimals + " decimals are allowed for To token");
            this.setState({loadingSwap: false});
            return
        }
        let factoryContract = new this.state.web3.eth.Contract(UniswapV2Factory, uniswapV2FactoryAddress);
        let pairAddress = await factoryContract.methods.getPair(tokenA, tokenB).call();
        if(pairAddress === '0x0000000000000000000000000000000000000000'){
            alert('Liquidity for the trading pair does not exist. Try conversions between pBTC ⇄ ERC20 pairs');
            this.setState({loadingSwap: false});
            return
        }
        try {
            let pairContract = new this.state.web3.eth.Contract(UniswapV2Pair, pairAddress);
            const token0Address = await pairContract.methods.token0().call();
            if (tokenA.toLowerCase() === WETHAddress.toLowerCase()) {
                let WETHContract = new this.state.web3.eth.Contract(WETH, WETHAddress);
                await WETHContract.methods.deposit().send({
                    from: this.state.account,
                    to: WETHAddress,
                    value: tokenAAmount
                });
            }
            await tokenAContract.methods.transfer(pairAddress, tokenAAmount).send({from: this.state.account});
            if (tokenB.toLowerCase() === token0Address.toLowerCase()) {
                await pairContract.methods.swap(tokenBAmount, 0, this.state.account, '0x').send({from: this.state.account});
            } else {
                await pairContract.methods.swap(0, tokenBAmount, this.state.account, '0x').send({from: this.state.account});
            }
            if (tokenB.toLowerCase() === WETHAddress.toLowerCase()) {
                let WETHContract = new this.state.web3.eth.Contract(WETH, WETHAddress);
                await WETHContract.methods.withdraw(tokenBAmount).send({from: this.state.account});
            }
        }
        catch(e){
            console.log(e);
            alert('Token Swap failed');
        }
        await this.updateTokenBalances();
        this.setState({loadingSwap: false});
    }

    updateTokenDepositAddress(value){
        this.setState({tokenDepositAddress: value})
    }

    updateTokenDepositAmount(value){
        if(value === ''){
            this.setState({tokenDepositAmount: value});
            return
        }
        let valid = value.match(/^[+]?(?=.?\d)\d*(\.\d{0,18})?$/);
        if(!valid){
            return
        }
        this.setState({tokenDepositAmount: value})
    }

    updateaTokenRedeemAddress(value){
        this.setState({aTokenRedeemAddress: value})
    }

    updateaTokenRedeemAmount(value){
        if(value === ''){
            this.setState({aTokenRedeemAmount: value});
            return
        }
        let valid = value.match(/^[+]?(?=.?\d)\d*(\.\d{0,18})?$/);
        if(!valid){
            return
        }
        this.setState({aTokenRedeemAmount: value})
    }

    async depositToken(){
        if (this.state.tokenDepositAmount === '') {
            return;
        }
        let tokenAddress = this.state.tokenDepositAddress;
        this.setState({loadingTokenDeposit: true});
        const ERC20Contract = new this.state.web3.eth.Contract(ERC20ABI, tokenAddress);
        const decimals = await ERC20Contract.methods.decimals().call();
        let amount;
        try {
            if (decimals === '6') {
                amount = this.state.web3.utils.toWei(this.state.tokenDepositAmount, "mwei").toString();
            } else {
                amount = this.state.web3.utils.toWei(this.state.tokenDepositAmount, "ether").toString();
            }
        }
        catch(e){
            alert('Only ' + decimals + ' decimals are supported for the token');
            this.setState({loadingTokenDeposit: false});
            return;
        }
        const referralCode = '0';
        const lendingPoolAddressProviderContract = new this.state.web3.eth.Contract(LendingPoolAddressProvider,
            lendingPoolAddressProviderAddress);
        const lendingPoolCoreAddress = await lendingPoolAddressProviderContract.methods.getLendingPoolCore().call();
        if(tokenAddress.toLowerCase() !== depositTokenMapping['ETH'].toLowerCase()) {
            try {
                await ERC20Contract.methods.approve(lendingPoolCoreAddress, amount).send({from: this.state.account})
            } catch (e) {
                console.log(e);
                alert('Deposit Token failed');
                this.setState({loadingTokenDeposit: false});
                return
            }
        }
        const lendingPoolAddress = await lendingPoolAddressProviderContract.methods.getLendingPool().call();
        const lendingPoolContract = new this.state.web3.eth.Contract(LendingPool, lendingPoolAddress);
        try {
            if(tokenAddress.toLowerCase() !== depositTokenMapping['ETH'].toLowerCase()) {
                await lendingPoolContract.methods.deposit(tokenAddress, amount, referralCode)
                    .send({from: this.state.account});
            }else{
                await lendingPoolContract.methods.deposit(tokenAddress, amount, referralCode)
                    .send({from: this.state.account, value: amount});
            }
        } catch (e) {
            console.log(e);
            alert('Deposit Token failed');
        }
        await this.updateTokenBalances();
        this.setState({loadingTokenDeposit: false});
    }

    async redeemaToken(){
        if (this.state.aTokenRedeemAmount === '') {
            alert('amount is required');
            return;
        }
        let tokenAddress = this.state.aTokenRedeemAddress;
        this.setState({loadingaTokenRedeem: true});
        const contract = new this.state.web3.eth.Contract(AToken, tokenAddress);
        const decimals = await contract.methods.decimals().call();
        let amount;
        try {
            if (decimals === '6') {
                amount = this.state.web3.utils.toWei(this.state.aTokenRedeemAmount, "mwei").toString();
            } else {
                amount = this.state.web3.utils.toWei(this.state.aTokenRedeemAmount, "ether").toString();
            }
        }
        catch(e){
            alert('Only ' + decimals + ' decimals are supported for the token');
            this.setState({loadingaTokenRedeem: false});
            return;
        }
        try {
            await contract.methods.redeem(amount).send({from: this.state.account});
        }
        catch (e){
            console.log(e);
            alert('Redeem aTokens failed');
        }
        await this.updateTokenBalances();
        this.setState({loadingaTokenRedeem: false});
    }

    updateStreamToken(value){
        this.setState({streamToken: value})
    }

    updateStreamAmount(value){
         if(value === ''){
            this.setState({streamAmount: value});
            return
        }
        let valid = value.match(/^[+]?(?=.?\d)\d*(\.\d{0,18})?$/);
        if(!valid){
            return
        }
        this.setState({streamAmount: value})
    }

    updateStreamRecipient(value){
        this.setState({streamRecipient: value})
    }

    updateStreamStartTime(value){
        this.setState({streamStartTime: value})
    }

     updateStreamStopTime(value){
        this.setState({streamStopTime: value})
    }

    updateStreamWithdrawAmount(value){
         if(value === ''){
            this.setState({streamWithdrawAmount: value});
            return
        }
        let valid = value.match(/^[+]?(?=.?\d)\d*(\.\d{0,18})?$/);
        if(!valid){
            return
        }
        this.setState({streamWithdrawAmount: value})
    }

    updateWithdrawStreamId(value){
        if(value === ''){
            this.setState({withdrawStreamId: value});
            return
        }
        let valid = value.match(/^\d+$/);
        if(!valid){
            return
        }
        this.setState({withdrawStreamId: value})
    }

    async createStream(){
        let amount = this.state.streamAmount;
        let recipient = this.state.streamRecipient;
        let startTime = this.state.streamStartTime;
        let stopTime = this.state.streamStopTime;
        let tokenAddress = this.state.streamToken;
        if(amount === '' || recipient === '' || startTime === '' || stopTime === '' || tokenAddress === ''){
            return
        }
        startTime = startTime.unix();
        stopTime = stopTime.unix();
        let date = new Date();
        let seconds = Math.round(date.getTime() / 1000);
        if(startTime - seconds < 300){
            alert('Start time should be at least 5 minutes in future');
            return
        }
        if(stopTime - startTime < 60 * 60){
            alert('The stream should last atleast for an hour');
            return
        }
        this.setState({loadingCreateStream: true});
        const erc20Contract = new this.state.web3.eth.Contract(ERC20ABI, tokenAddress);
        let decimals = await erc20Contract.methods.decimals().call();
        try {
            if (decimals === '6') {
                amount = this.state.web3.utils.toWei(amount, "mwei");
            } else {
                amount = this.state.web3.utils.toWei(amount, "ether");
            }
        }
        catch(e){
            alert('Only ' + decimals + ' decimals are supported for the selected token');
            this.setState({loadingCreateStream: false});
            return
        }
        let mod = (amount % (stopTime - startTime));
        if(mod !== 0){
            let updatedStreamAmount;
            if(decimals === '6') {
               updatedStreamAmount = amount - mod;
               if(updatedStreamAmount === 0){
                   updatedStreamAmount = stopTime - startTime;
               }
               updatedStreamAmount = this.state.web3.utils.fromWei(updatedStreamAmount.toString(), "mwei").toString();
            }
            else{
                updatedStreamAmount = amount - mod;
                if(updatedStreamAmount === 0){
                   updatedStreamAmount = stopTime - startTime;
                }
                updatedStreamAmount = this.state.web3.utils.fromWei(updatedStreamAmount.toString(), "ether").toString();
            }
            alert("Update Stream Amount to " + updatedStreamAmount.toString() +
                " to proceed ahead (Sablier Requires amount to be multiple of the difference between stop and start time)");
            this.setState({loadingCreateStream: false});
            return
        }
        amount = amount.toString();
        const sablierContract = new this.state.web3.eth.Contract(Sablier, sablierAddress);
        try {
            await erc20Contract.methods.approve(sablierAddress, amount).send({from: this.state.account})
        } catch (e) {
            console.log(e);
            alert('Create Stream Failed');
            this.setState({loadingCreateStream: false});
            return
        }
        try {
            let data = await sablierContract.methods.createStream(recipient, amount, tokenAddress,
                startTime.toString(), stopTime.toString()).send({from: this.state.account});
            let streamId = data.events.CreateStream.returnValues.streamId;
            this.setState({streamId: streamId.toString()});
        } catch (e) {
            console.log(e);
        }
        await this.updateTokenBalances();
        this.setState({loadingCreateStream: false});
    }

    async withdrawStream(){
        let streamId = this.state.withdrawStreamId;
        let streamWithdrawAmount = this.state.streamWithdrawAmount;
        if(streamId === '' || streamWithdrawAmount === ''){
            alert('All fields are required');
            return
        }
        this.setState({loadingWithdrawStream: true});
        const sablierContract = new this.state.web3.eth.Contract(Sablier, sablierAddress);
        let stream;
        try {
            stream = await sablierContract.methods.getStream(streamId).call();
        }
        catch(e){
            alert('Either Stream does not exist or amount is already withdrawn from stream');
            this.setState({loadingWithdrawStream: false});
            return;
        }
        let tokenAddress = stream['tokenAddress'];
        let remainingBalance = parseInt(stream['remainingBalance']);
        let remainingBalanceHuman;
        const erc20Contract = new this.state.web3.eth.Contract(ERC20ABI, tokenAddress);
        let decimals = await erc20Contract.methods.decimals().call();
        try {
            if (decimals === '6') {
                streamWithdrawAmount = this.state.web3.utils.toWei(streamWithdrawAmount, "mwei").toString();
                remainingBalanceHuman = this.state.web3.utils.fromWei(stream['remainingBalance'], "mwei").toString();
            } else {
                streamWithdrawAmount = this.state.web3.utils.toWei(streamWithdrawAmount, "ether").toString();
                remainingBalanceHuman = this.state.web3.utils.fromWei(stream['remainingBalance'], "ether").toString();
            }
        }
        catch(e){
            alert('Only ' + decimals + ' decimals are supported for the stream token');
            this.setState({loadingWithdrawStream: false});
            return
        }
        if(streamWithdrawAmount > remainingBalance){
            alert('Withdraw from Stream Failed since stream balance is ' + remainingBalanceHuman);
            this.setState({loadingWithdrawStream: false});
            return;
        }
        try {
            await sablierContract.methods.withdrawFromStream(streamId, streamWithdrawAmount).send({from: this.state.account});
        } catch (e) {
            console.log(e);
            alert('Withdraw from Stream Failed');
        }
        await this.updateTokenBalances();
        this.setState({loadingWithdrawStream: false});
    }

    async componentWillMount() {
        if (this.web3Modal.cachedProvider){
            this.login();
        }
    }

    render() {
        if(this.state.account === ''){
            return (
                <div className="panel-landing  h-100 d-flex" id="section-1">
                    <nav className="container">
                        <div>
                            <h3 style={{float: "left", marginTop: "15px", marginLeft: "15px"}}>DeFi BTC</h3>
                            <div className="nav-wrapper Container" style={{"float": "right"}}>
                                <button className="login" onClick={this.login.bind(this)}>
                                    Connect
                                </button>
                            </div>
                        </div>
                    </nav>
                    <div className="container row" style={{marginTop: "50px"}}>
                        <div className="col l8 m12">

                            <p className="h2">
                                Bringing Bitcoin to DeFi
                            </p>
                            <p className="h6" style={{marginTop: "10px"}}>
                                Deposit Bitcoin and get equivalent pBTC (Powered by pTokens)
                            </p>
                            <p className="h6" style={{marginTop: "10px"}}>
                                pBTC can be redeemed for Bitcoin anytime
                            </p>
                            <Image src="https://siasky.net/GAATYiTwoe_0weTFzWHXoPEnuwaAjqrGasRPWENsLbT4mg" style={{height: "320px", width: "650px", marginTop: "10px"}} fluid/>

                        </div>
                    </div>
                    <div className="container row" style={{marginTop: "30px"}}>
                        <div className="col l8 m12">

                            <p className="h2">
                                Swap pBTC to ERC20 tokens
                            </p>
                            <p className="h6" style={{marginTop: "10px"}}>
                                Swap pBTC to ERC20 tokens like WBTC, DAI, USDT, etc. (Powered by Uniswap V2)
                            </p>
                            <Image src="https://siasky.net/MAAdsCwzqGpkpqiNwi3RrOSrp8tL-ixwweyv6mGfDF-J5g" style={{height: "320px", width: "650px", marginTop: "10px"}} fluid/>

                        </div>
                    </div>
                    <div className="container row" style={{marginTop: "30px"}}>
                        <div className="col l8 m12">

                            <p className="h2">
                                Deposit Tokens to Earn Interest using aTokens
                            </p>
                            <p className="h6" style={{marginTop: "10px"}}>
                                Convert pBTC to WBTC and deposit it to Aave to get interest using aWBTC
                            </p>
                            <p className="h6" style={{marginTop: "10px"}}>
                                You earn interest for every ethereum block
                            </p>
                            <p className="h6" style={{marginTop: "10px"}}>
                                aTokens can be redeemed to get Tokens back anytime
                            </p>
                            <Image src="https://siasky.net/dAB9Z03zG4it4AA-vKbxh77O5_cFMAI7efhU8GjNtKZq7Q" style={{height: "320px", width: "650px", marginTop: "10px"}} fluid/>

                        </div>
                    </div>
                    <div className="container row" style={{marginTop: "30px", marginBottom: "40px"}}>
                        <div className="col l8 m12">

                            <p className="h2">
                                Stream Tokens using Sablier
                            </p>
                            <p className="h6" style={{marginTop: "10px"}}>
                                Easily Stream tokens like pBTC, WBTC, DAI, Aave Interest Bearing Tokens, etc.
                            </p>
                            <p className="h6" style={{marginTop: "10px"}}>
                                Redeem tokens from stream in a single click
                            </p>
                            <Image src="https://siasky.net/BADxGMd7KvW-2dUR5TSYnSs9hd3y4qsbZIAtNaBcFd0CAw" style={{height: "320px", width: "650px", marginTop: "10px"}} fluid/>

                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="App">
                <div>

                    <Navbar bg="primary" variant="dark">
                        <div style={{width: "90%"}}>
                            <Navbar.Brand href="/">
                                <b>DeFi BTC</b>
                            </Navbar.Brand>
                        </div>
                        <Button variant="default btn-sm" onClick={this.logout.bind(this)} style={{float: "right"}}>
                            Logout
                        </Button>
                    </Navbar>

                    <div style={{margin: "20px"}}>
                        <div>
                            <div><b>Account:</b> {this.state.account}</div>
                            <div><b>pBTC Balance:</b> {this.state.tokenBalances['pBTC']}</div>
                            <div>
                                <Button variant="primary btn-sm" onClick={this.openTokenBalanceModal.bind(this)}>
                                    Other token balances
                                </Button>
                            </div>
                            <Modal show={this.state.showTokenBalanceModal} onHide={this.closeTokenBalanceModal.bind(this)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Other Token Balances</Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                                    <div>
                                        {
                                            Object.keys(this.state.tokenBalances).map((key, index) => {
                                                if (key === 'pBTC') {
                                                } else {
                                                    return <div><b>{key}:</b> {this.state.tokenBalances[key]}</div>
                                                }
                                            })
                                        }
                                    </div>
                                </Modal.Body>
                            </Modal>
                            <br/>


                            <div><p className="h5">Issue pBTC (Peg-in)</p></div>
                            <div>
                                <input className="form-control" type="text" placeholder="Ethereum Address"
                                       value={this.state.pBTCAccount}
                                       onChange={e => this.updateIssuepBTCAddress(e.target.value)}/>
                            </div>
                            <div>
                                <Button variant="primary btn" onClick={this.generateBTCPayAddress.bind(this)}
                                        loading={this.state.loadingIssue} style={{marginTop: "10px"}}>Generate Deposit
                                    Address</Button>
                            </div>
                            {
                                this.state.BTCAddress &&
                                <div style={{marginTop: "10px"}}>
                                    <QRCode value={this.state.BTCAddress}/>
                                    <p>{this.state.BTCAddress}</p>
                                    <p>Any BTC deposit sent to this address will mint an equal number of pBTC tokens on
                                        the ETH address above</p>
                                </div>
                            }
                            <br/>


                            <h5>Redeem pBTC to get BTC</h5>
                            <div>
                                <input className="form-control" type="text" placeholder="Amount in pBTC"
                                       value={this.state.pBTCRedeemAmount}
                                       onChange={e => this.updatepBTCRedeemAmount(e.target.value)}/>
                            </div>
                            <div style={{marginTop: "10px"}}>
                                <input className="form-control" type="text" placeholder="BTC Address"
                                       value={this.state.BTCRedeemAddress}
                                       onChange={e => this.updatepBTCRedeemAddress(e.target.value)}/>
                            </div>
                            <div style={{marginTop: "10px"}}>
                                <Button variant="primary btn" onClick={this.redeempBTC.bind(this)}
                                        loading={this.state.loadingRedeem}
                                >Redeem pBTC</Button>
                            </div>
                            <br/>


                            <h5>Swap Tokens</h5>
                            <div><p className="h5">From</p></div>
                            <div style={{marginBottom: "10px"}}>
                                <select className="form-control-sm"
                                        style={{width: "48%", marginRight: "30px"}}
                                        value={this.state.tokenSwapFrom}
                                        onChange={e => this.updateTokenSwapFrom(e.target.value)}>
                                    <option value={pBTCAddress}>pBTC</option>
                                    {
                                        Object.keys(depositTokenMapping).map((key, index) => {
                                            if(key === 'ETH'){
                                                return <option value={WETHAddress}>{key}</option>
                                            }
                                            else {
                                                return <option value={depositTokenMapping[key]}>{key}</option>
                                            }
                                        })
                                    }
                                </select>
                                <input className="form-control-sm" type="text" placeholder="Amount"
                                       style={{width: "48%"}}
                                       value={this.state.tokenSwapFromAmount}
                                       onChange={e => this.updateTokenSwapFromAmount(e.target.value)}/>
                            </div>
                            <div><p className="h5">To</p></div>
                            <div style={{marginBottom: "10px"}}>
                                <select className="form-control-sm"
                                        style={{width: "48%", marginRight: "30px"}}
                                        value={this.state.tokenSwapTo}
                                        onChange={e => this.updateTokenSwapTo(e.target.value)}>
                                    <option value={pBTCAddress}>pBTC</option>
                                    {
                                        Object.keys(depositTokenMapping).map((key, index) => {
                                            if(key === 'ETH'){
                                                return <option value={WETHAddress}>{key}</option>
                                            }
                                            else {
                                                return <option value={depositTokenMapping[key]}>{key}</option>
                                            }
                                        })
                                    }
                                </select>
                                <input className="form-control-sm" type="text" placeholder="Amount"
                                       style={{width: "48%"}}
                                       value={this.state.tokenSwapToAmount}
                                       onChange={e => this.updateTokenSwapToAmount(e.target.value)}/>
                            </div>
                            <Button variant="primary btn" onClick={this.swap.bind(this)}
                                        loading={this.state.loadingSwap}
                                >Swap</Button>
                            <br/>
                            <br/>


                            <h5>Deposit Tokens to earn interest using aTokens</h5>
                            <div>
                                <select className="form-control"  style={{marginBottom: "10px"}}
                                        value={this.state.tokenDepositAddress}
                                        onChange={e => this.updateTokenDepositAddress(e.target.value)}>
                                    {
                                        Object.keys(depositTokenMapping).map((key, index) => (
                                            <option value={depositTokenMapping[key]}>{key}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div style={{marginBottom: "10px"}}>
                                <input className="form-control" type="text" placeholder="Amount"
                                       value={this.state.tokenDepositAmount}
                                       onChange={e => this.updateTokenDepositAmount(e.target.value)}/>
                            </div>
                            <div>
                                <Button variant="primary btn" onClick={this.depositToken.bind(this)}
                                        loading={this.state.loadingTokenDeposit}
                                >Deposit Tokens</Button>
                            </div>
                            <br/>


                            <h5>Redeem aTokens to get Tokens</h5>
                            <div>
                                <select className="form-control"  style={{marginBottom: "10px"}}
                                        value={this.state.aTokenRedeemAddress}
                                        onChange={e => this.updateaTokenRedeemAddress(e.target.value)}>
                                    {
                                        Object.keys(redeemaTokenMapping).map((key, index) => (
                                            <option value={redeemaTokenMapping[key]}>{key}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div>
                                <input className="form-control" type="text" placeholder="Amount"
                                       value={this.state.aTokenRedeemAmount}
                                       onChange={e => this.updateaTokenRedeemAmount(e.target.value)}/>
                            </div>
                            <div>
                                <Button variant="primary btn" onClick={this.redeemaToken.bind(this)} style={{marginTop: "10px"}}
                                        loading={this.state.loadingaTokenRedeem}
                                >Redeem aTokens</Button>
                            </div>
                            <br/>


                            <h5>Create a Sablier Stream</h5>
                            <div style={{marginBottom: "10px"}}>
                                <select className="form-control"
                                        value={this.state.streamToken}
                                        onChange={e => this.updateStreamToken(e.target.value)}>
                                    <option value={pBTCAddress}>pBTC</option>
                                    {
                                        Object.keys(depositTokenMapping).map((key, index) => {
                                            if (key === 'ETH') {

                                            } else {
                                                return <option value={depositTokenMapping[key]}>{key}</option>
                                            }
                                        })
                                    }
                                    {
                                        Object.keys(redeemaTokenMapping).map((key, index) => (
                                            <option value={redeemaTokenMapping[key]}>{key}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div style={{marginBottom: "10px"}}>
                                <input className="form-control" type="text" placeholder="Amount"
                                       value={this.state.streamAmount}
                                       onChange={e => this.updateStreamAmount(e.target.value)}/>
                            </div>
                            <div style={{marginBottom: "10px"}}>
                               <Datetime inputProps={{ placeholder: 'Start Time' }} onChange={value => this.updateStreamStartTime(value)} value = {this.state.streamStartTime} />
                            </div>
                            <div style={{marginBottom: "10px"}}>
                                <Datetime inputProps={{ placeholder: 'Stop Time' }} onChange={value => this.updateStreamStopTime(value)} value = {this.state.streamStopTime}/>
                            </div>
                            <div style={{marginBottom: "10px"}}>
                                <input className="form-control" type="text" placeholder="Recipient Address"
                                       value={this.state.streamRecipient}
                                       onChange={e => this.updateStreamRecipient(e.target.value)}/>
                            </div>
                            <div style={{marginBottom: "5px"}}>
                                <Button variant="primary btn" onClick={this.createStream.bind(this)}
                                        loading={this.state.loadingCreateStream}
                                >Create Stream</Button>
                            </div>
                            {this.state.streamId &&
                            <div>
                                Stream id: {this.state.streamId}
                            </div>
                            }
                            <br/>


                            <h5>Withdraw from Sablier Stream</h5>
                            <div style={{marginBottom: "10px"}}>
                                <input className="form-control" type="text" placeholder="Stream Id"
                                       value={this.state.withdrawStreamId}
                                       onChange={e => this.updateWithdrawStreamId(e.target.value)}/>
                            </div>
                            <div style={{marginBottom: "10px"}}>
                                <input className="form-control" type="text" placeholder="Withdraw Amount"
                                       value={this.state.streamWithdrawAmount}
                                       onChange={e => this.updateStreamWithdrawAmount(e.target.value)}/>
                            </div>
                             <div style={{marginBottom: "5px"}}>
                                <Button variant="primary btn" onClick={this.withdrawStream.bind(this)}
                                        loading={this.state.loadingWithdrawStream}
                                >Withdraw</Button>
                            </div>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App
