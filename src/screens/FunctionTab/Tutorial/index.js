import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Markdown from 'react-native-markdown-display'

//网络设置
const TutorialScreen = (props) => {
  const [key, setKey] = useState(props.route.params.key || 'Home')

  const Tutorial = {
    Home: `
# **[首页](oxo://Home)**
## [应用](oxo://App) [公告](oxo://Bulletin) [私聊](oxo://Chat) [频道](oxo://Channel) [群组](oxo://Group) [服务](oxo://Service) [问题](oxo://FAQ)
---
---
---
---
---
---
---
---
---
---
---
---
### 目标
**重拾互联网精神和以人为本精神，便利个人自由使用互联网进行信息互动**

### 优点
1. 基于密码学，个人账号在本地生成，无需注册，无需提供手机号、身份证等个人信息
2. 基于密码学，个人发出所有消息均使用个人账户私钥进行签名，服务器及消息接收个人对消息进行校验，防止消息被篡改、伪造
3. 基于密码学，私聊、群组的聊天消息采用端到端（Peer-to-Peer）进行加密，只有发送个人和接收个人能够解密消息，服务器无法知道聊天内容
4. 消息格式开源，任何人都可以根据消息格式开发客户端、服务端应用
5. 消息格式开源，任何人都可以部署服务，为其他人提供互联网服务
6. 数据本地化，个人可以自由携带自己的本地数据，连接互联网服务提供方，避免服务提供方删数据
7. 项目代码开源，无隐藏后面、恶意代码（**[App项目源码](https://github.com/oxogenesis/oxo-chat-app)**、**[服务端项目源码](https://github.com/oxogenesis/oxo-chat-server)**）

### 思想原则
- 以人为本原则：准确的说是以个人为本源，从个人意志、权益出发，服务于个人，古早的互联网应用BBS、Mail在设计和运营方面基本考虑还是以人为本的，通过技术手段为个人创造便利，而当今的互联网应用更加偏重资本的商业利益，狭隘、短视、不注重保护个人权益
- 互联网协议思想：互联网信息的传输是根据协议，按照协议不同厂家生产的软硬件可以通信，服务个人的互联网应用及服务也应基于协议
- 数据分类分级原则：公告消息是公开消息，只需要防篡改、防伪造；聊天消息是非公开消息，还需要加密保护，防止被包括服务端在内的无关方知道
- 零信任原则：没有消息推送，要看信息必须手动关注对方、与对方成为好友、加入频道或群组，个人能看到的信息是个人自主或个人之间的信任表现，应用默认设置应该是零信任
- 区块链思想：个人发出去的各类型消息均单独成链，强制所有个人都不得否认自己的历史消息，促进长期诚实守信
- **网物分离、人为媒介**思想：物理空间是需要稳定审慎的，网络空间是可以开放灵活的，个人首先存在和生活在物理空间，个人在物理空间通常是被束缚压抑的，但个人在网络空间中更自由解放，可以拥有多重身份多份精彩多种可能，随着信息科技的发展，网络空间日益向物理空间渗透，并借助深度神经网络技术呈现出智能化、自治化的特征，诸如chatGPT、无人驾驶网约车、智能机器狗等应用已经超出个人使用者的控制，个人应当拒绝在物理空间使用不受个人控制的应用或服务，反对在自己活动的物理空间出现不受本人控制的智能应用，也就是说其他人在自己家里、企业在自己园区应用智能技术我没意见，但是你的智能狗、智能车在公共空间出现我是坚决反对的，个人只能将自己信任的网络空间接入自己的物理空间，涉及到接入公共物理空间时需要相关个人先达成共识。
- 用爱发电：区别于互联网平台先抢占市场再盈利的思路，在利用资本的同时也被资本绑架；好的初创应用一旦被资本盯上，极大可能被使用了资本的互联网平台企业打败或收购，只能说这些应用对个人还不够好，对初创应用的发起人更好，可以让发起人赚到可观的收益，才会被资本盯上；用爱发电最大的问题是持续性不太好，软件是最适合用爱发电的领域，只要放弃盈利或者直接盈利的想法，开发软件解决自己问题的同时，开源出来方便他人，如果这个问题有很多个人需要解决，自然这个应用软件会成功。
`,
    App: `
# [首页](oxo://Home)
## **[应用](oxo://App)** [公告](oxo://Bulletin) [私聊](oxo://Chat) [频道](oxo://Channel) [群组](oxo://Group) [服务](oxo://Service) [问题](oxo://FAQ)
---
---
---
---
---
---
---
---
---
---
---
---
## [App项目源码](https://github.com/oxogenesis/oxo-chat-app)

---

### 口令
**口令**用于加密保存账号的种子，由于**账号种子**只存储在个人设备上，不保存在服务器上，个人应该牢记口令，并且对账号种子进行备份

### 账号种子（Seed）
**账号种子**用于生成账号的密钥对（**私钥**和**公钥**），私钥用于对**消息**进行**签名**，（消息、公钥、消息签名）三元组用于可以校验三者是否匹配，防止消息被篡改或伪造
账号种子为以x开头29位Base58编码的字符串

### 账号地址（Address）
账号地址是对账号公钥进行转换后，以o开头33-34位Base58编码的字符串

### 账号昵称
**账号昵称**用于在个人设备上对账号地址进行标注，便于个人记忆

### Base58编码
Base58编码的字符集是0-9、a-z、A-Z共62个字符去掉0、I、O、l后剩下的58个字符：
123456789
ABCDEFGH JKLMN PQRSTUVWXYZ
abcdefghijk mnopqrstuvwxyz

### 消息
消息采用Json格式，通常包含Action或者ObjectType、Sequence、Timestamp、PublicKey、Signature字段
- Action用于标识消息的动作类型
- ObjectType用于标识消息的内容类型
- Sequence用于标识消息的序号，从1开始，没多一条消息增加1
- Timestamp用于标识消息的生成时间
- PublicKey用于标识签发消息的账号公钥
- Signature为消息的签名

---

### 关注（Follow）
通过添加关注账号操作，获取并在本地保持该账号的所有公告


---

### 好友（Friend）
通过添加好友账号操作，尝试与对方建立好友关系，如果对方同意，可以开始私聊


`,
    Bulletin: `
# [首页](oxo://Home)
## [应用](oxo://App) **[公告](oxo://Bulletin)** [私聊](oxo://Chat) [频道](oxo://Channel) [群组](oxo://Group) [服务](oxo://Service) [问题](oxo://FAQ)
---
---
---
---
---
---
---
---
---
---
---
---
### 公告定位
公告是用于个人发布公开消息，以更加自由、开放的方式实现论坛、微博、推特、博客、公众号等互联网应用服务业态

---

### 公告优点
1. 匿名性：由于账号是本地生成，公告的签发账号与具体个人的对应关系无权威机构认定
2. 原子性：每条公告都是使用签发账号进行了签名，每条公告都可以被校验，保证了公告内容的不变性
3. 无审核：网络不是法外之地，但互联网平台审核很多时候是不讲法律的，比如不能留联系方式、不能转发其他平台链接，还有很多打着安全旗号的措施大大降低了信息流动的便利性
4. 通用性：个人发布的帖子、推文、微博文章、博客文章、公众号文章等均可以使用公告的标准格式进行同步发布，这就意味着个人可以在互联网平台发布帖子类、文章类信息时，使用公告对这些信息进行备份
5. 传播不受限：基于以上匿名性、原子性、无审核等特点，是的公告易于传播并且几乎不受限制，当然所有的传播都是个人阅读公告后个人自主选择的传播，没有平台通过算法推送的传播（当然也可以建设这样的推送平台，公告的设计本身只是对数据格式、校验规则的定义，不含用户画像、算法推荐）

---

### 公告消息字段
公告（Bulletin）消息为内容消息，其ObjectType为101，除了ObjectType、Timestamp、PublicKey、Signature字段外，还必须包含以下字段：
- Sequence为公告的编号，从1开始，每发一条消息，编号加1
- PreHash为本条公告的前一条公告的哈希值，通过该字段可以确保前一条公告不被再次生成或替换，让一个账号的所有公告形成一条链
- Content为公告的内容

此外还可以包含以下字段：
- Quote为公告引用其他公告的数组，目前最多可以引用8条公告，通过引用其他公告可以实现对其他公告的评论功能，与其他公告建立关联关系，从而实现论坛帖子、微博、推特的评论功能，每条被引用公告需要包含以下字段：
  - Address为被引用公告的账号地址
  - Sequence为被引用公告的序号
  - Hash为被引用公告的哈希值
- File为公告的附件信息数组，公告消息不包含文件的内容，只包含文件基本信息，目前附件只支持txt、md、jpeg、png文件格式，文件大于0字节，小于10Mb每个附件需要包含以下字段：
  - Name为附件的文件名
  - Ext为附件的文件扩展名
  - Size为附件的字节数
  - Hash为附件的哈希值

### 公告消息格式
{
&ensp;&ensp;"type": "object",
&ensp;&ensp;"required":&ensp;["ObjectType",&ensp;"Sequence",&ensp;"PreHash",&ensp;"Content",&ensp;"Timestamp",&ensp;"PublicKey",&ensp;"Signature"],
&ensp;&ensp;"maxProperties":&ensp;9,
&ensp;&ensp;"properties":&ensp;{
&ensp;&ensp;&ensp;&ensp;"ObjectType":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"number",
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"const":&ensp;ObjectType.Bulletin
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Sequence":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"number"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"PreHash":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Content":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Quote":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"array",
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"minItems":&ensp;0,
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"maxItems":&ensp;8,
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"items":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"object",
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"required":&ensp;["Address",&ensp;"Sequence",&ensp;"Hash"],
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"properties":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"Address":&ensp;{&ensp;"type":&ensp;"string"&ensp;},
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"Sequence":&ensp;{&ensp;"type":&ensp;"number"&ensp;},
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"Hash":&ensp;{&ensp;"type":&ensp;"string"&ensp;}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;}
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"File":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"array",
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"minItems":&ensp;0,
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"maxItems":&ensp;8,
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"items":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"object",
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"required":&ensp;["Name",&ensp;"Ext",&ensp;"Size",&ensp;"Hash"],
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"properties":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"Name":&ensp;{&ensp;"type":&ensp;"string"&ensp;},
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"Ext":&ensp;{&ensp;"type":&ensp;"string"&ensp;},
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"Size":&ensp;{&ensp;"type":&ensp;"number"&ensp;},
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"Hash":&ensp;{&ensp;"type":&ensp;"string"&ensp;}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;}
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Timestamp":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"number"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"PublicKey":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Signature":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;}
&ensp;&ensp;}
}
`,
    Chat: `
# [首页](oxo://Home)
## [应用](oxo://App) [公告](oxo://Bulletin) **[私聊](oxo://Chat)** [频道](oxo://Channel) [群组](oxo://Group) [服务](oxo://Service) [问题](oxo://FAQ)
---
---
---
---
---
---
---
---
---
---
---
---
### 私聊定位
私聊是用于实现两个个人在网络空间端到端的加密聊天

---

### 私聊优点
1. 匿名性：由于账号是本地生成，私聊消息的签发账号与具体个人的对应关系无权威机构认定
2. 保密性：两个个人在发送消息前需要先协商会话密钥，会话密钥只有个人的设备知道，每条私聊消息内容都使用会话密钥进行加密，所以可以保证只有拿到个人设备才能只看到聊天内容，服务器不知道聊天内容
3. 原子性：每条私聊消息都是使用签发账号进行了签名，每条私聊消息都可以被校验，保证了私聊消息内容的不变性
4. 无审核：网络不是法外之地，但互联网平台审核很多时候是不讲法律的，比如不能留联系方式、不能转发其他平台链接，还有很多打着安全旗号的措施大大降低了信息流动的便利性

---

### 私聊消息字段
私聊（ChatMessage）消息为内容消息，其ObjectType为202，除了ObjectType、Timestamp、PublicKey、Signature字段外，还必须包含以下字段：
- Sequence为私聊的编号，从1开始，每发一条消息，编号加1
- PreHash为本条私聊的前一条私聊的哈希值，通过该字段可以确保前一条私聊不被再次生成或替换，让一个账号的所有私聊形成一条链
- Content为私聊的内容
- To为接收私聊消息个人的账号地址

此外还可以包含以下字段：
- ACK为已接收私聊消息的确认，内容为相关消息的数组：
  - Sequence为被确认私聊消息的序号
  - Hash为被确认私聊消息的哈希值

---

### 私聊消息格式
{
&ensp;&ensp;"type":&ensp;"object",
&ensp;&ensp;"required":&ensp;["ObjectType",&ensp;"Sequence",&ensp;"PreHash",&ensp;"Content",&ensp;"To",&ensp;"Timestamp",&ensp;"PublicKey",&ensp;"Signature"],
&ensp;&ensp;"maxProperties":&ensp;9,
&ensp;&ensp;"properties":&ensp;{
&ensp;&ensp;&ensp;&ensp;"ObjectType":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"number",
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"const":&ensp;ObjectType.ChatMessage
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Sequence":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"number"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"PreHash":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"ACK":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"array",
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"minItems":&ensp;0,
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"maxItems":&ensp;8,
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"items":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"object",
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"required":&ensp;["Sequence",&ensp;"Hash"],
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"maxProperties":&ensp;5,
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"properties":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"Sequence":&ensp;{&ensp;"type":&ensp;"number"&ensp;},
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"Hash":&ensp;{&ensp;"type":&ensp;"string"&ensp;}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;}
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Content":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"To":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Timestamp":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"number"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"PublicKey":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Signature":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;}
&ensp;&ensp;}
}

---

### 会话密钥协商消息字段
私聊会话密钥协商（ChatDH）消息为内容消息，其ObjectType为201，除了ObjectType、Timestamp、PublicKey、Signature字段外，还必须包含以下字段：
- Partition为会话密钥有效期限
- Sequence为会话有效期编号
- DHPublicKey为迪菲-赫尔曼密钥交换（Diffie–Hellman key exchange）算法公钥
- Pair为会话密钥协商对方的消息，用于告诉对方已经收到协商消息
- To为接收协商会话密钥的个人账号地址

---

### 会话密钥协商消息格式
{
&ensp;&ensp;"type":&ensp;"object",
&ensp;&ensp;"required":&ensp;["ObjectType",&ensp;"Partition",&ensp;"Sequence",&ensp;"DHPublicKey",&ensp;"Pair",&ensp;"To",&ensp;"Timestamp",&ensp;"PublicKey",&ensp;"Signature"],
&ensp;&ensp;"maxProperties":&ensp;9,
&ensp;&ensp;"properties":&ensp;{
&ensp;&ensp;&ensp;&ensp;"ObjectType":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"number",
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"const":&ensp;ObjectType.ChatDH
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Partition":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"number"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Sequence":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"number"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"DHPublicKey":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Pair":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"To":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Timestamp":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"number"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"PublicKey":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;},
&ensp;&ensp;&ensp;&ensp;"Signature":&ensp;{
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"type":&ensp;"string"
&ensp;&ensp;&ensp;&ensp;}
&ensp;&ensp;}
}
`,
    Channel: `
# [首页](oxo://Home)
## [应用](oxo://App) [公告](oxo://Bulletin) [私聊](oxo://Chat) **[频道](oxo://Channel)** [群组](oxo://Group) [服务](oxo://Service) [问题](oxo://FAQ)

TODO...
`,
    Group: `
# [首页](oxo://Home)
## [应用](oxo://App) [公告](oxo://Bulletin) [私聊](oxo://Chat) [频道](oxo://Channel) **[群组](oxo://Group)** [服务](oxo://Service) [问题](oxo://FAQ)

TODO...
`,
    Service: `
# [首页](oxo://Home)
## [应用](oxo://App) [公告](oxo://Bulletin) [私聊](oxo://Chat) [频道](oxo://Channel) [群组](oxo://Group) **[服务](oxo://Service)** [问题](oxo://FAQ)
---
---
---
---
---
---
---
---
---
---
---
---
## [服务端项目源码](https://github.com/oxogenesis/oxo-chat-server)

---

### 公告服务
校验、缓存、分发个人发布的公告消息

---

### 私聊服务
校验、缓存、分发个人发送的私聊消息，由于会话密钥只保持在个人设备上，服务器无法解密私聊消息的内容


### 频道服务
校验、缓存、分发个人发送的频道消息，由于变化的多人无法协商出固定的密钥对消息内容加密，频道消息对服务器不保密

### 群组服务
校验、转发个人发送的群组消息，通过群组内成员个人之间两两协商密钥，对群组消息进行加密，实现聊天内容对服务器保密；但每次消息转发都需要进行加密，同一条群组消息内容需要多次转发来通知群组成员

`,
    FAQ: `
# [首页](oxo://Home)
## [应用](oxo://App) [公告](oxo://Bulletin) [私聊](oxo://Chat) [频道](oxo://Channel) [群组](oxo://Group) [服务](oxo://Service) **[问题](oxo://FAQ)**
---
---
---
---
---
---
---
---
---
---
---
---
### 权限
- 文件权限：文件操作需要“所有文件访问权限”权限（**需要手动设置**）
- 照相机权限：扫码功能需要“照相机”权限
`
  }

  const onLinkPress = (url) => {
    const tutorial_regx = /^oxo:\/\/*/
    if (tutorial_regx.exec(url)) {
      let tutorial_key = url.replace('oxo://', '')
      setKey(tutorial_key)
      return false
    } else if (url == '') {
      return false
    }

    // return true to open with `Linking.openURL
    // return false to handle it yourself
    return true
  }

  const styles = StyleSheet.create({
    body: {
      color: '#9FE2BF', fontSize: 12
    },
    code_block: {
      color: 'black', fontSize: 14
    },
    heading1: {
      fontSize: 32,
      // backgroundColor: '#000000',
      // color: '#FFFFFF',
    },
    heading2: {
      fontSize: 24,
    },
    heading3: {
      fontSize: 18,
    },
    heading4: {
      fontSize: 16,
    },
    heading5: {
      fontSize: 13,
    },
    heading6: {
      fontSize: 11,
    }
  });

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: '100%', backgroundColor: 'black' }}
        >
          <Markdown onLinkPress={onLinkPress} style={styles}>
            {Tutorial[key]}
          </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const ReduxTutorialScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TutorialScreen)

export default ReduxTutorialScreen