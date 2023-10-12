
KioskBoard.init({
    keysArrayOfObjects: null,
    keysJsonUrl: "dist/kioskboard-keys-english.json",
    capsLockActive: false,
})

KioskBoard.run('.js-kioskboard-input', {})

main_buttons_shown = false

BACK_IMAGES = [
    'back06.jpg',
    'back02.jpg',
    'back03.jpg',
    'back04.jpg',
    'back05.jpg',
    'back01.jpg',
]
BACK_IMAGE_NUM = 0

AUDIO_CLIPS = [
    'clip1.mp3',
    'clip2.mp3',
    'clip3.mp3',
    'clip4.mp3',
    'clip5.mp3',
    'clip6.mp3',
    'clip7.mp3',
    'clip8.mp3',
    'clip9.mp3',
    'clip10.mp3',
    'clip11.mp3',
    'clip12.mp3',
]
AUDIO_CLIP_NUM = 11
CUR_AUDIO = null

function click_main(event) {
    a = document.getElementById('bt_config')
    b = document.getElementById('bt_video')
    c = document.getElementById('bt_background')
    d = document.getElementById('bt_audio')
    if(main_buttons_shown) {
        cn = 'main_buttons_hidden'
    } else {
        cn = 'main_buttons_shown'
    }
    main_buttons_shown = ! main_buttons_shown
    a.className = cn
    b.className = cn
    c.className = cn
    d.className = cn
}

function bt_config(event) {
    event.stopPropagation()
    a = document.getElementById('main')
    b = document.getElementById('config')
    b.style.display = 'block'
    a.style.display = 'none'
}
function bt_cfg_done(event) {
    a = document.getElementById('config')
    b = document.getElementById('main')
    b.style.display = 'block'
    a.style.display = 'none'
}

function bt_audio(event) {
    if(event) {
        event.stopPropagation()
    }
    AUDIO_CLIP_NUM = AUDIO_CLIP_NUM+1
    if(AUDIO_CLIP_NUM>=AUDIO_CLIPS.length) {
        AUDIO_CLIP_NUM = 0
    }    
    if(CUR_AUDIO!=null) {
        CUR_AUDIO.pause()
        CUR_AUDIO.currentTime = 0
    }
    CUR_AUDIO = new Audio('audio/'+AUDIO_CLIPS[AUDIO_CLIP_NUM])
    CUR_AUDIO.volume = 1.0
    CUR_AUDIO.play()
}

function bt_video(event) {
    event.stopPropagation()
    alert('VIDEO')
}

function bt_background(event) {
    event.stopPropagation()
    b = document.getElementById('main')
    BACK_IMAGE_NUM = BACK_IMAGE_NUM+1
    if(BACK_IMAGE_NUM>=BACK_IMAGES.length) {
        BACK_IMAGE_NUM = 0
    }
    b.style.backgroundImage="url('backgrounds/back0"+(BACK_IMAGE_NUM+1)+".jpg')"
}

active_tab = 'wifi'
function bt_cfg_tab(tab) {
    a = document.getElementById('bt_cfg_'+tab)
    a.classList.toggle('cfg_tab_active')
    b = document.getElementById('div_cfg_'+tab)
    b.style.display = 'block'
    c = document.getElementById('bt_cfg_'+active_tab)
    c.classList.toggle('cfg_tab_active')
    d = document.getElementById('div_cfg_'+active_tab)
    d.style.display = 'none'  
    active_tab = tab
    if(tab==update) {
        // Check on the update.py version
    }
}

function starting_up(event) {    
    bt_audio()
}

function send_message(msg) {
    ws.send(JSON.stringify(msg))
}

var ws = new WebSocket("ws:/"+window.location.host+"/ws")

ws.onopen = function() {}

ws.onmessage = function(evt) {
    msg = JSON.parse(evt.data)
    // alert("got back:"+msg['error'])
}
