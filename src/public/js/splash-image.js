AFRAME.registerComponent('splash-image', {
    schema: {
        disableWorldTracking: {type: 'bool', default: false},
        requestGyro: {type: 'bool', default: false},
    },
    init() {
        const splashimage = document.getElementById('splashimage')
        const start = document.getElementById('start')
        const loadingicon = document.getElementById('loadImage')
        const elem = document.getElementById('myBar')
        const loadingbar = document.getElementById('loadingbar')
        const message = document.getElementById('changeToPortrait')
        const portrait = window.matchMedia('(orientation: portrait)')

        portrait.addEventListener('change', (e) => {
            if (e.matches) {
              // Portrait mode
              message.style.display = 'none'
            } else {
              // Landscape
              message.style.display = 'block'
            }
        })
      
        console.log('landing page')

        start.style.display = 'block'
      
        loadingicon.style.display = 'none'
    
        let i = 0
        let width
        let id
        const seconds = 1000
      
        function frame() {
            if (width >= 100) {
                clearInterval(id)
                i = 0
            } else {
                width++
                elem.style.width = `${width}%`
            }
        }
    
        function move() {
            if (i === 0) {
                i = 1
                id = setInterval(frame, seconds)
            }
        }
      
        const cameraStatusChange = ({status}) => {
            switch (status) {
                case 'hasVideo':
                    width = 99
                    console.log(`has video so width is ${width}`)
                    break
                case 'requesting':
                    move()
                    width = 5
                    console.log(`requesting video so width is ${width}`)
                    break
                case 'failed':
                    width = 5
                default:
                    break
            }
        }
      
        XR8.addCameraPipelineModule({
            name: 'mycamerapipelinemodule',
            onCameraStatusChange: cameraStatusChange,
        })
    
        const addXRWeb = () => {
            console.log('clicked start')
            loadingbar.style.display = 'block'
            start.style.display = 'none'
            
            if (this.data.requestGyro === true && this.data.disableWorldTracking === true) {
                // If world tracking is disabled, and you still want gyro enabled (i.e. 3DoF mode)
                // Request motion and orientation sensor via XR8's permission API
                XR8.addCameraPipelineModule({
                    name: 'request-gyro',
                    requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
                })
            }
    
            this.el.sceneEl.setAttribute('xrweb', `disableWorldTracking: ${this.data.disableWorldTracking}`)
           
            const delaying = () => {
                loadingbar.style.display = 'none'
                splashimage.classList.add('hidden')
            }
        
            this.el.sceneEl.addEventListener('realityready', () => {
                console.log('reality ready')
                const waitafew = setTimeout( delaying, 500)
            })
        
            this.el.sceneEl.addEventListener('realityerror', (e) => {
                console.log(e.detail.error)
                loadingbar.style.display = 'none'
            })
        }

        start.onclick = addXRWeb
    },
})