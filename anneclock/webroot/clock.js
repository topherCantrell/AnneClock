
KioskBoard.init({
    keysArrayOfObjects: null,
    keysJsonUrl: "dist/kioskboard-keys-english.json",
    capsLockActive: false,
})

KioskBoard.run('.js-kioskboard-input', {})

main_buttons_shown = false


BACK_IMAGES = [
    {
        'name':'back01.jpg',   
        'digital_time': [450, 20],
        'digital_date': [670, 600],       
        'clock_color': '#cd1515',
        'month_color': '#cd1515',
        'day_of_week_color': '#cd1515',
        'date_color':'#cd1515'
    },
    {
        'name':'back02.jpg',  
        'digital_time': [60, 20],
        'digital_date': [670, 300],           
        'clock_color': 'purple',
        'month_color': 'purple',
        'day_of_week_color': 'purple',
        'date_color':'purple'      
    },
    {
        'name':'back03.jpg',         
        'digital_time': [80, 80],
        'digital_date': [0, 600],          
        'clock_color': 'whitesmoke',
        'month_color': 'whitesmoke',
        'day_of_week_color': 'whitesmoke',
        'date_color':'whitesmoke'  
    },
    {
        'name':'back04.jpg',  
        'digital_time': [40, 40],
        'digital_date': [10, 580],        
        'clock_color': 'darkblue',
        'month_color': 'darkblue',
        'day_of_week_color': 'darkblue',
        'date_color':'darkblue'      
    },
    {
        'name':'back05.jpg',    
        'digital_time': [20, 0],
        'digital_date': [670, 580],        
        'clock_color': 'whitesmoke',
        'month_color': 'whitesmoke',
        'day_of_week_color': 'whitesmoke',
        'date_color':'whitesmoke'     
    },
    {
        'name':'back06.jpg',                 
        'digital_time': [20, 0],
        'digital_date': [670, 600],                
        'clock_color': 'purple',
        'month_color': 'purple',
        'day_of_week_color': 'purple',
        'date_color':'purple'     
    },    
    {
        'name':'back08.jpg',   
        'digital_time': [20, 600],
        'digital_date': [670, 600],    
        'clock_color': 'blue',
        'month_color': 'red',
        'day_of_week_color': 'red',
        'date_color':'red'      
    },
    {
        'name':'back09.jpg',        
        'digital_time': [600, 160],
        'digital_date': [600, 500],        
        'clock_color': 'whitesmoke',
        'month_color': 'whitesmoke',
        'day_of_week_color': 'whitesmoke',
        'date_color':'whitesmoke'
    },
    {
        'name':'back10.jpg',     
        'digital_time': [660, 0],
        'digital_date': [0, 600],       
        'clock_color': 'whitesmoke',
        'month_color': 'whitesmoke',
        'day_of_week_color': 'whitesmoke',
        'date_color':'whitesmoke'   
    },
    {
        'name':'back11.jpg',        
        'digital_time': [660, 450],
        'digital_date': [660, 600],       
        'clock_color': 'whitesmoke',
        'month_color': 'whitesmoke',
        'day_of_week_color': 'whitesmoke',
        'date_color':'whitesmoke'   
    },
    {
        'name':'back12.jpg',       
        'digital_time': [0, 600],
        'digital_date': [660, 600],        
        'clock_color': '#c1233b',
        'month_color': '#c1233b',
        'day_of_week_color': '#c1233b',
        'date_color':'#c1233b'    
    },
]
BACK_IMAGE_NUM = -1

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
    a = document.getElementById('clock_digital_time')
    b = document.getElementById('clock_digital_date')
    b.style.display = 'none'
    a.style.display = 'none'
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
    if(event) {
        event.stopPropagation()
    }
    a = document.getElementById('main')
    BACK_IMAGE_NUM = BACK_IMAGE_NUM+1
    if(BACK_IMAGE_NUM>=BACK_IMAGES.length) {
        BACK_IMAGE_NUM = 0
    }
    info = BACK_IMAGES[BACK_IMAGE_NUM]
    a.style.backgroundImage="url('backgrounds/"+(BACK_IMAGES[BACK_IMAGE_NUM]['name'])
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

bt_background()

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
    time_minute = date.getMinutes() // 0-59 (make this print 2 digits)
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
    time_minute_org = time_minute
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
        if((time_minute%10)==0) {
            // Every 10 minutes
            bt_background()
        }
        if(time_minute==0) {
            // On the hour
            bt_audio()
        }        
    }

}

updateDateTime()
window.setInterval(updateDateTime, 1000*10);