const config = {
    "nodeStyle":new Set(["khoanh","hatde","huongduong","phan"]),
    "lineNow":[
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
    ],
    "player":{
        "q":0,
        "time":0,
    },
    "role":null,
    "page":0,
    "numberNotCall":new Set(),
    "numberCalled":new Set(),
    "color":["#fc8f00","#59b002"]
}

window.onload = async(e)=>{
    const asset= {
        music:{
            main : new Music("./asset/music/kiepdoden.mp3"),
            loto1 : new Music("./asset/music/loto1.mp3"),
            loto2 : new Music("./asset/music/loto2.mp3"),
            loto3 : new Music("./asset/music/loto3.mp3")
        },
        sfx:{
            shake: new Sound("./asset/sfx_shake.mp3")
        },
        img:{
            "phan":[
                "./asset/img/phan/0.png",
                "./asset/img/phan/1.png",
                "./asset/img/phan/2.png"],
            "khoanh":[
                "./asset/img/khoanh/0.png"],    
            "hatde":[
                "./asset/img/hatde/0.png",
                "./asset/img/hatde/1.png",
                "./asset/img/hatde/2.png",
                "./asset/img/hatde/3.png",
                "./asset/img/hatde/4.png"],
            "huongduong":[
                "./asset/img/huongduong/0.png",
                "./asset/img/huongduong/1.png",
                "./asset/img/huongduong/2.png",
                "./asset/img/huongduong/3.png"],
        }
    }
    const lyric = await getJson("./asset/lyrics.json")
    const loto = await getJson("./asset/loto.json")
    const listLoto = document.querySelector(".list-box")
    const broadGame = document.querySelector("#gameplay .boardgame")
    //Tạo list
    loto.forEach((e,i)=>{
        listLoto.innerHTML+=`
        <li>
            <div class="overlay">
                <div class="selection">
                    Chọn
                </div>
            </div>
            ${createTableLoto(e)}
        </li>
        `
    })
    
    //Gameplay   
    ready()
    initEventHome(config)
    initEventList(config,asset,loto)
    initEventVolume(asset) 
    window.onresize()
    initEventMusic(asset,config)
}   

function initEventList(config,asset,loto){
    const lotos = document.querySelectorAll(".list-box .overlay .selection")
    Array.from(lotos).forEach((e,i)=>{
        e.onclick = ()=>{
            config.page = i
            document.querySelector("#list").classList.add("hidden")
            document.querySelector("#gameplay").classList.remove("hidden")
            window.onresize()
            const broadGame = document.querySelector("#gameplay .boardgame")
            broadGame.innerHTML = createTableLoto(loto[i],`
                <div class="tick">
                    <img src="./asset/img/hatde/0.png">
                </div>`)
            initEventGameplay(asset)
        }
    })
}

function initEventHome(config) {
    const boxButton = document.querySelector("#home .box-button")
    const btns = boxButton.querySelectorAll(".button")

    btns[0].onclick = ()=>{
        config.role = "host"
        document.querySelector("#home").classList.add("hidden")
        document.querySelector("#list").classList.remove("hidden")
    }

    btns[1].onclick = ()=>{
        config.role = "player"
        document.querySelector("#home").classList.add("hidden")
        document.querySelector("#list").classList.remove("hidden")
    }
}

function initEventMusic(asset,config) {
    const title = document.querySelector("#player .title")
    const time = document.querySelector("#player .time")
    const progg = document.querySelector("#player .progress")
    const child = progg.querySelector(".child")
    const prev = document.querySelector("#player .prev")
    const next = document.querySelector("#player .next")
    const pp = document.querySelector("#player .pause")
    const icon = pp.querySelector("i")
    const music = [
        {
            name:"Loto Sai Gon Tan Thoi",
            r:asset.music.loto1
        },{
            name:"Loto Sai Gon Tan Thoi 2",
            r:asset.music.loto2
        },{
            name:"Loto Cha Cha Cha",
            r:asset.music.loto3
        }        
    ]

    let now = music[config.player.q]
    title.innerText = now.name
    pp.onclick = function(){
        icon.classList.toggle("fa-play")
        icon.classList.toggle("fa-pause")
        if (icon.classList.contains("fa-pause")) {
            now.r.play()
        }else{
            now.r.pause()
        }
    }
    setInterval(()=>{
        const dur = now.r.duration
        const cur = now.r.currentTime
        time.innerText = setTime(cur)+"/"+setTime(dur)
        child.style.width = (cur/dur)*100+"%"
        if (cur+.5>=dur) {
            now.r.pause()
            icon.classList.toggle("fa-play")
            icon.classList.toggle("fa-pause")
            now.r.currentTime = 0
        }
    },500)
    next.onclick=()=>{
        now.r.currentTime = 0
        now.r.pause()
        config.player.q = (config.player.q +1 >= music.length)?0:config.player.q+1;
        now = music[config.player.q]
        title.innerText = now.name
        icon.classList.add("fa-play")
        icon.classList.remove("fa-pause")
        setTimeout(()=>{
            pp.onclick()
        },200)
    }
    prev.onclick=()=>{
        now.r.currentTime = 0
        now.r.pause()
        config.player.q = (config.player.q -1 < 0)?music.length-1:config.player.q-1;
        now = music[config.player.q]
        title.innerText = now.name
        icon.classList.add("fa-play")
        icon.classList.remove("fa-pause")
        setTimeout(()=>{
            pp.onclick()
        },200)
    }
    progg.onclick = function(e){
        let r = this.clientWidth
        let c = e.offsetX
        now.r.currentTime= c/r * now.r.duration
    }
}

function initEventGameplay(asset) {
    window.onresize()
    if(config.role!="host") {
        document.querySelector("#lon").style.display = "none"
        document.querySelector("#gameplay .mobile .img").style.display = "none"
    }
    // const broadGame = document.querySelector("#gameplay .boardgame")
    // if (window.innerWidth <= window.innerHeight*7/12) {
    //     broadGame.style.scale = window.innerWidth / (window.innerHeight*7/12)
    // }

    const listNode = document.querySelector("#gameplay .more .list-item")
    for (const i in asset.img) {
        let li= document.createElement("li")
        li.className = "active"
        li.innerHTML = `
        <img src="${asset.img[i][0]}" alt="" srcset="">
        <div class="overlay">
            <i class="fa-solid fa-check"></i>
        </div>
        `
        li.title = i.toString()
        listNode.appendChild(li)
        li.onclick = function(){
            if (config.nodeStyle.has(this.title)) {
                if (config.nodeStyle.size <=1) return
                config.nodeStyle.delete(this.title)
                this.classList.remove("active")
            }else{
                config.nodeStyle.add(this.title)
                this.classList.add("active")
            }
        }
    }

    const lotoPaper = document.querySelector("#gameplay .loto-paper")
    const rows = Array.from(lotoPaper.querySelectorAll("tr"))
    const nodes = lotoPaper.querySelectorAll("td")
    Array.from(nodes).forEach((e,i)=>{
        let t = e.querySelector(".tick")
        if (!t) return
        t.onclick = ()=>{
           e.classList.toggle("show")
           let type = getRandom(config.nodeStyle)
           t.querySelector("img").src = getRandom(asset.img[type])
           t.querySelector("img").style.rotate = Math.random()*360 + "deg"
           if (config.lineNow[Math.floor(i/9)].has(t)) {
                config.lineNow[Math.floor(i/9)].delete(t)
            }else{
                    config.lineNow[Math.floor(i/9)].add(t)
            }
            if (config.lineNow[Math.floor(i/9)].size==4) {
                rows[Math.floor(i/9)].classList.add(`effect`)
            }else{
                rows[Math.floor(i/9)].classList.remove(`effect`)
            }

            if (config.lineNow[Math.floor(i/9)].size==5) {
                rows[Math.floor(i/9)].classList.add(`win`)
            }else{
                rows[Math.floor(i/9)].classList.remove(`win`)
            }
        }
    })
    const more = document.querySelector("#gameplay .more")
    const menuBtn = document.querySelector("#menu")
    menuBtn.onclick = ()=>{
        more.classList.toggle("show")
    }

    //Loto
    for (let i=1;i<=90;i++) {
        config.numberNotCall.add(i)
    }
    const lonBtn = document.querySelector("#lon .img")
    const listCalled = document.querySelector(".more .list-number")
    const animationLayer = document.querySelector("#animation")
    let r = 0
    document.querySelector("#gameplay .mobile .img").onclick = ()=>{
        lonBtn.onclick()
    }
    lonBtn.onclick = ()=>{
        r = getRandom(config.numberNotCall)
        // console.log(r)
        config.numberNotCall.delete(r)
        config.numberCalled.add(r)
        animationLayer.classList.add("show")
        animationLayer.classList.add("wait")
        animationLayer.querySelector(".number").innerHTML=`
        <div style="border: 16px solid ${config.color[r%config.color.length]};">
            <span>${r}</span>
        </div>
        `
        asset.sfx.shake.currentTime = 0
        asset.sfx.shake.play()

    }
    animationLayer.querySelector(".number").onclick=()=>{
        animationLayer.querySelector(".lon2").onclick()
    }
    animationLayer.querySelector(".lon2").onclick = function(){
        if (animationLayer.classList.contains("wait")) {
            animationLayer.classList.remove("wait")
            animationLayer.querySelector(".number").classList.add("show")
            listCalled.innerHTML+=`
        <div style="border: 5px solid ${config.color[r%config.color.length]};">
            <span>${r}</span>
         </div>
        `
            return
        }
        if (animationLayer.classList.contains("show")) {
            animationLayer.classList.remove("show")
            more.classList.remove("show")
            animationLayer.querySelector(".number").classList.remove("show")
            return
        }
    }
}

function initEventVolume(asset) {
    const volMusic = document.querySelector("#vol-music")
    const volSfx = document.querySelector("#vol-sfx")

    volMusic.oninput = ()=>{
        for (const i in asset.music) {
            asset.music[i].setVolume(parseFloat(volMusic.value))
        }
        
    }

    volSfx.oninput = ()=>{
        for (const i in asset.sfx) {
            asset.sfx[i].setVolume(parseFloat(volSfx.value))

        }
        
    }
}

window.onresize = ()=>{
    const broadGame = document.querySelector("#gameplay .boardgame")
    if (window.innerWidth <= window.innerHeight*7/12) {
        broadGame.style.scale = window.innerWidth / (window.innerHeight*7/12)
    }

    let fsize = 16*1/window.devicePixelRatio
    if (window.innerHeight-100 < window.innerWidth) {
        broadGame.style.fontSize = fsize + "px"
    }

    const more = document.querySelector("#gameplay .more")
    more.classList.remove("show")
}

async function ready() {
    const setting = document.querySelector("#setting")
    const settingSwitch = setting.querySelector("i")
    const settingClose = setting.querySelector(".close")
    settingSwitch.onclick = ()=>{
        setting.querySelector(".box").classList.toggle("hidden")
    }
    settingClose.onclick = ()=>{
        setting.querySelector(".box").classList.toggle("hidden")
    }
}

async function initEvent() {

}

async function getJson(url) {
    return await fetch(url)
    .then((res)=>res.json())
    .then((data)=>data)
    .catch((err)=>{
        console.log(err)
        alert("Lỗi tải game, vui lòng làm mới trang!")
    })
}

class Sound  extends Audio{
    setVolume(x) {
        if (x>=0 && x<=1) {
            this.volume = x
        }
    }

    play(x = -1) {
        if (x>=0 && x<=1) {            
            this.volume = x
        }
        super.play()
    }
}

class Music extends Audio{
    setVolume(x) {
        if (x>=0 && x<=1) {
            this.volume = x
        }
    }

    play(x=-1) {
        if (x>=0 && x<=1) {            
            this.volume = x
        }
        super.play()
    }
}

function createTableLoto(obj,x="") {
    let h = ["","",""]
    obj[1].forEach((e,i) => { 
        let l=""       
        e.forEach((ee,ii)=>{
            l+=`<td>${(ee>0?ee+x:"")}</td>`
        })
        h[Math.floor(i/3)]+=`<tr>${l}</tr>`
    });

    return `
    <div class="loto-paper">
        <style>
        .loto-paper table td:empty {
            background-color: ${obj[0]};
        }
        </style>

        <p>
            <span>❖❖❖❖❖❖❖❖❖❖❖❖</span>
            <span>MPC CLUB</span>
            <span>❖❖❖❖❖❖❖❖❖❖❖❖</span>
        </p>
        <table>
            ${h[0]}
        </table>
        <p>
            <span>❖❖❖❖❖❖❖❖❖❖</span>
            <span>#TetCungOUMPC</span>
            <span>❖❖❖❖❖❖❖❖❖❖</span>
        </p>
        <table>
            ${h[1]}
        </table>
        <p>
            <span>❖❖❖❖❖❖❖❖❖❖</span>
            <span>Mã đáo thành công</span>
            <span>❖❖❖❖❖❖❖❖❖❖</span>
        </p>
        <table>
            ${h[2]}
        </table>
        <p>
            <span>❖❖❖❖❖❖❖❖❖❖</span>
            <span>TÂN THỚI TỐT NHẤT</span>
            <span>❖❖❖❖❖❖❖❖❖❖</span>
        </p>
    </div>
    `
}

function setTime(s) {
    let mm = Math.floor(s / 60)
    let ss = Math.floor(s % 60)
    return ((mm<10)?"0"+mm:mm) + ":" + ((ss<10)?"0"+ss:ss)
}

function getRandom(array) {
    let array0 = Array.from(array)
    return array0[Math.floor(Math.random()*array0.length)]
}