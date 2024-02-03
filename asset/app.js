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
    "color":["#fc8f00","#59b002"],
    "vol":{
        music:0,
        sfx:0
    },
    "ho":false,
    "lyric":[]

}



window.onload = async(e)=>{
    //Backup setting
    
    const asset= {
        music:{
            main : new Music("./asset/music/kiepdoden.mp3"),
            loto1 : new Music("./asset/music/loto1.mp3"),
            loto2 : new Music("./asset/music/loto2.mp3"),
            loto3 : new Music("./asset/music/loto3.mp3"),
            loto4 : new Music("./asset/music/loto4.mp3"),
            loto5 : new Music("./asset/music/loto5.mp3")
        },
        sfx:{
            shake: new Sound("./asset/sfx_shake.mp3"),
            volchange: new Sound("./asset/SE_VOLCHANGE_SE_UI.mp3"),
            win: new Sound("./asset/SE_RESULT_SUPERSTAR.mp3")
        },
        img:{
            "phan":[
                "./asset/img/phan/0.png",
                "./asset/img/phan/1.png",
                "./asset/img/phan/2.png",
                "./asset/img/phan/4.png",
                "./asset/img/phan/3.png"],
            "khoanh":[
                "./asset/img/khoanh/0.png",    
                "./asset/img/khoanh/1.png",    
                "./asset/img/khoanh/2.png",    
                "./asset/img/khoanh/3.png",    
                "./asset/img/khoanh/4.png",    
                "./asset/img/khoanh/5.png"],    
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
           
        },
        lyric:await getJson("./asset/lyrics.json")
    }
    asset.music.main.play(.2)

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
    ready(asset)
    initEventHome(config,asset)
    initEventList(config,asset,loto)
    initEventVolume(asset) 
    window.onresize()
    initEventMusic(asset,config)
    try {
        await backupSetting(asset) 
    } catch (error) {
        localStorage.clear("lotoStyle")
        localStorage.clear("lotoVol")
    }
}   

async function backupSetting(asset)  {
    let nodeStyleSave =localStorage.getItem("lotoStyle")
    let flag1 = true
    if (nodeStyleSave) {
        nodeStyleSave= await JSON.parse(nodeStyleSave)
        for (const i of nodeStyleSave) {
            if (!config.nodeStyle.has(i)) {
                flag1=false
                break
            }
        }
        if (flag1) {
            config.nodeStyle = new Set(nodeStyleSave)
        }
    }
    let volSave =localStorage.getItem("lotoVol")
    if (volSave) {
        volSave = await JSON.parse(volSave)
        if (volSave && "music" in volSave && "sfx" in volSave) {
            config.vol = volSave
            document.querySelector("#vol-music").value = volSave.music
            document.querySelector("#vol-sfx").value = volSave.sfx
            for (const i in asset.music) {
                asset.music[i].setVolume(parseFloat(volSave.music))
            }
            for (const i in asset.sfx) {
                asset.sfx[i].setVolume(parseFloat(volSave.sfx))            
            }
        }
    }
    let checkedHo = localStorage.getItem("lotoHo")
    if (checkedHo && checkedHo=="true") {
        config.ho = true
        document.querySelector("#hoLoto").checked = config.ho 
    }
    
}

function initEventList(config,asset,loto){
    const lotos = document.querySelectorAll(".list-box .overlay .selection")
    Array.from(lotos).forEach((e,i)=>{
        e.onclick = ()=>{
            
            asset.sfx.volchange.play()
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

function initEventHome(config,asset) {
    const boxButton = document.querySelector("#home .box-button")
    const btns = boxButton.querySelectorAll(".button")

    btns[0].onclick = ()=>{
        asset.sfx.volchange.play()
        config.role = "host"
        document.querySelector("#home").classList.add("hidden")
        document.querySelector("#list").classList.remove("hidden")
    }

    btns[1].onclick = ()=>{
        asset.sfx.volchange.play()
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
        }    ,{
            name:"Loto Mien tay",
            r:asset.music.loto4
        }   ,{
            name:"Nhạc xổ số",
            r:asset.music.loto5
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
    asset.music.main.pause()
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
        if (config.nodeStyle.has(i)) {
            li.className = "active"
        }
        li.innerHTML = `
        <img src="${asset.img[i][0]}" alt="" srcset="">
        <div class="overlay">
            <i class="fa-solid fa-check"></i>
        </div>
        `
        li.title = i.toString()
        listNode.appendChild(li)
        li.onclick = function(){
            asset.sfx.volchange.play()
            if (config.nodeStyle.has(this.title)) {
                if (config.nodeStyle.size <=1) return
                config.nodeStyle.delete(this.title)
                this.classList.remove("active")
            }else{
                config.nodeStyle.add(this.title)
                this.classList.add("active")
            }
            localStorage.setItem("lotoStyle",JSON.stringify(Array.from(config.nodeStyle)))
        }
    }

    const lotoPaper = document.querySelector("#gameplay .loto-paper")
    const rows = Array.from(lotoPaper.querySelectorAll("tr"))
    const nodes = lotoPaper.querySelectorAll("td")
    Array.from(nodes).forEach((e,i)=>{
        let t = e.querySelector(".tick")
        if (!t) return
        t.onclick = ()=>{
            asset.sfx.volchange.play()
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


            let win = false
           config.lineNow.forEach((e,i)=>{
                if (e.size==5) {
                    win=true
                }
           })
           if (win) {
                document.querySelector("#win").classList.add("show")
                asset.sfx.win.play()

           }else{
                document.querySelector("#win").classList.remove("show")
           }
        }
    })
    const more = document.querySelector("#gameplay .more")
    const menuBtn = document.querySelector("#menu")
    menuBtn.onclick = ()=>{
        asset.sfx.volchange.play()
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
    const switchHoLoto = document.querySelector("#hoLoto")
    const guidesHoLoto = document.querySelector("#animation .lyric")
    //Bật hò loto   
    switchHoLoto.oninput = function() {
        config.ho = this.checked
        localStorage.setItem("lotoHo",JSON.stringify(this.checked))
    }
    guidesHoLoto.onclick = ()=>{
        asset.sfx.volchange.play()
        guidesHoLoto.querySelector("p").innerText = getRandom(config.lyric)
    }
    lonBtn.onclick = ()=>{        
        if (!config.ho) {
            document.querySelector(".box .lyric").style.display = "none"
        }else{
            document.querySelector(".box .lyric").style.display = "block"
        }

        r = getRandom(config.numberNotCall)
        config.lyric = asset.lyric[r%10]
        guidesHoLoto.querySelector("p").innerText = getRandom(config.lyric)

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
        config.vol.music = parseFloat(volMusic.value)
        localStorage.setItem("lotoVol",JSON.stringify(config.vol))
        asset.sfx.volchange.play()
    }

    volSfx.oninput = ()=>{
        for (const i in asset.sfx) {
            asset.sfx[i].setVolume(parseFloat(volSfx.value))            
        }
        config.vol.sfx = parseFloat(volSfx.value)
        localStorage.setItem("lotoVol",JSON.stringify(config.vol))
        asset.sfx.volchange.play()
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

async function ready(asset) {
    const setting = document.querySelector("#setting")
    const settingSwitch = setting.querySelector("i")
    const settingClose = setting.querySelector(".close")
    settingSwitch.onclick = ()=>{
        asset.sfx.volchange.play()
        setting.querySelector(".box").classList.toggle("hidden")
    }
    settingClose.onclick = ()=>{
        asset.sfx.volchange.play()
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
        this.currentTime=0
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
        <p>
            <span>❖❖❖❖❖❖❖❖❖❖❖❖</span>
            <span>MPC CLUB</span>
            <span>❖❖❖❖❖❖❖❖❖❖❖❖</span>
        </p>
        <table style="background-color: ${obj[0]};">
            ${h[0]}
        </table>
        <p>
            <span>❖❖❖❖❖❖❖❖❖❖</span>
            <span>#TetCungOUMPC</span>
            <span>❖❖❖❖❖❖❖❖❖❖</span>
        </p>
        <table style="background-color: ${obj[0]};">
            ${h[1]}
        </table>
        <p>
            <span>❖❖❖❖❖❖❖❖❖❖</span>
            <span>Mã đáo thành công</span>
            <span>❖❖❖❖❖❖❖❖❖❖</span>
        </p>
        <table style="background-color: ${obj[0]};">
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