
// Initialize the keyboard
//
KioskBoard.init({
    keysArrayOfObjects: null,
    keysJsonUrl: "dist/kioskboard-keys-english.json",
    capsLockActive: false,
})
KioskBoard.run('.js-kioskboard-input', {})

// Main buttons are not visible
main_buttons_shown = false

// Waiting for the theme in the config info
theme = ''

// Clicked on the main screen -- not on a corner
//
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

// Clicked on the CONFIGURE button
//
function bt_config(event) {    
    event.stopPropagation()
    a = document.getElementById('main')
    b = document.getElementById('config')
    b.style.display = 'block'
    a.style.display = 'none'
    a = document.getElementById('clock_digital_time')
    b = document.getElementById('clock_digital_date')
    b.style.display = 'none'
    a.style.display = 'none'
    updateDateTime()    
}
function bt_cfg_done(event) {
    a = document.getElementById('config')
    b = document.getElementById('main')
    b.style.display = 'block'
    a.style.display = 'none'
    a = document.getElementById('clock_digital_time')
    b = document.getElementById('clock_digital_date')
    b.style.display = 'block'
    a.style.display = 'block'
}

function bt_set_theme(event, new_theme) {
    event.stopPropagation()
    if(new_theme != theme) {
        msg = {
            'cmd': 'set_theme',
            'theme': new_theme
        }
        send_message(msg)        
    }
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
    CUR_AUDIO = new Audio(theme+'/audio/'+AUDIO_CLIPS[AUDIO_CLIP_NUM])
    CUR_AUDIO.volume = 1.0
    CUR_AUDIO.play()
}

function bt_update(event) {
    event.stopPropagation()
    msg = {
        'cmd': 'update'
    }
    send_message(msg)
}

function bt_video(event) {
    event.stopPropagation()
    alert('VIDEO')
}

function bt_background(event) {
    if(event) {
        event.stopPropagation()
    }
    a = document.getElementById('main')
    BACK_IMAGE_NUM = BACK_IMAGE_NUM+1
    if(BACK_IMAGE_NUM>=BACK_IMAGES.length) {
        BACK_IMAGE_NUM = 0
    }
    info = BACK_IMAGES[BACK_IMAGE_NUM]
    a.style.backgroundImage="url('"+theme+"/backgrounds/"+(BACK_IMAGES[BACK_IMAGE_NUM]['name'])
    a = document.getElementById('clock_digital_time')
    a.style.left = info['digital_time'][0].toString()+'px'
    a.style.top = info['digital_time'][1].toString()+'px'
    a = document.getElementById('clock_digital_date')
    a.style.left = info['digital_date'][0].toString()+'px'
    a.style.top = info['digital_date'][1].toString()+'px'

    a = document.getElementById('digital_time')
    a.style.color = info['clock_color']
    a = document.getElementById('digital_am_pm')
    a.style.color = info['clock_color']
    a = document.getElementById('digital_day_of_week')
    a.style.color = info['day_of_week_color']
    a = document.getElementById('digital_month')
    a.style.color = info['month_color']
    a = document.getElementById('digital_date')
    a.style.color = info['date_color']
    
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
}

function send_message(msg) {
    ws.send(JSON.stringify(msg))
}

// We load these from the user's theme
BACK_IMAGE_NUM = -1
AUDIO_CLIP_NUM = -1
CUR_AUDIO = null       

var ws = new WebSocket("ws:/"+window.location.host+"/ws")
ws.onopen = function() {}
ws.onmessage = function(evt) {
    msg = JSON.parse(evt.data)
    if (msg['cmd'] == 'CONFIG_INFO') {      
        console.log('CONFIG'+JSON.stringify(msg))
        a = document.getElementById('cfg_wifi_ssid')
        a.value = msg['ssid']
        b = document.getElementById('cfg_wifi_psk')  
        b.value = msg['psk']        
        c = document.getElementById('cfg_wifi_status')        
        if(msg['net_connected'] === true) {
            c.textContent = 'Connected'
            c.style.color = 'green'
        } else if(msg['net_connected'] === false) {
            c.textContent = 'Not Connected'
            c.style.color = 'red'
        } else {
            c.textContent = '--unknown--'
            c.style.color = 'red'
        }
        window.setInterval(updateDateTime, 1000*10)         
        theme = msg['user_config']['theme']
        fetch('./'+theme+'/mediaInfo.json')
        .then(response => response.json())
        .then(data => {
            BACK_IMAGES = data['backgrounds']
            AUDIO_CLIPS = data['audio']
            BACK_IMAGE_NUM = -1
            AUDIO_CLIP_NUM = -1
            CUR_AUDIO = null   
            bt_background()
            bt_audio()         
        })        
    } else if (msg['cmd']=='latest_version') {
        a = document.getElementById('cfg_update_status')
        a.textContent = msg['info']
        a.style.color = msg['color']
    } else {
        console.log('Unknown message from server:'+JSON.stringify(msg))
    }
}

function bt_cfg_connect() {
    a = document.getElementById('cfg_wifi_ssid')
    b = document.getElementById('cfg_wifi_psk')
    msg = {
        'cmd': 'set_network',
        'ssid': a.value,
        'psk': b.value
    }
    send_message(msg)
}

function bt_check_update() {
    msg = {
        'cmd': 'check_update'
    }
    send_message(msg)
}
function bt_run_update() {
    msg = {
        'cmd': 'run_update'
    }
    send_message(msg)
}

const NAMES_WEEKDAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const NAMES_MONTH = ["January","February","March","April","May","June","July","August","September","October","November","December"]

current_date_time = ""

function updateDateTime() {
    const date = new Date()
    month = date.getMonth() // 0-11
    day_number = date.getDate() // 1-31
    day_name = date.getDay() // 0-6 (0=Sunday)
    time_hour = date.getHours() // 0-23
    time_hour_org = time_hour
    time_minute = date.getMinutes() // 0-59 (make this print 2 digits)
    time_minute_org = time_minute
    is_pm = false
    if (time_hour>=12) {
        time_hour = time_hour - 12
        is_pm = true
    }
    if (time_hour==0) {
        time_hour = 12
    }
    // to strings
    month = NAMES_MONTH[month]
    day_number = day_number.toString()
    day_name = NAMES_WEEKDAY[day_name]   
    time_hour = time_hour.toString()    
    if(time_minute<10) {
        time_minute = "0"+time_minute.toString()
    } else {
        time_minute = time_minute.toString()
    }  
    if(is_pm) {
        is_pm = "PM"
    } else {
        is_pm = "AM"
    }
    new_date_time = month+day_number+day_name+time_hour+time_minute+is_pm
    if(new_date_time != current_date_time) {        
        current_date_time = new_date_time        
        // update fields
        document.getElementById('digital_time').textContent = time_hour+':'+time_minute
        document.getElementById('digital_am_pm').textContent = is_pm
        //
        document.getElementById('digital_day_of_week').textContent = day_name
        document.getElementById('digital_month').textContent = month
        document.getElementById('digital_date').textContent = day_number
        //
        if((time_minute_org%10)==0) {
            // Every 10 minutes
            bt_background()
        }
        if(time_minute_org==0) {
            // On the hour
            if (time_hour_org>=7 && time_hour_org<=19) {
                // TODO let the user define the sleep interval. For now between 7 and 7 inclusive
                bt_audio()
            }            
        }        
    }

}
