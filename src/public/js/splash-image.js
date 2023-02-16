AFRAME.registerComponent('splash-image', {
    schema: {
        disableWorldTracking: {type: 'bool', default: false},
        requestGyro: {type: 'bool', default: false},
    },
    init() {
        const loadingScreen = document.querySelector("#loading-screen");
        // const splashimage = document.getElementById('splashimage')
        const start = document.querySelector("#ar-button")
        // const loadingicon = document.getElementById('loadImage')
        // const elem = document.getElementById('myBar')
        // const loadingbar = document.getElementById('loadingbar')
        // const message = document.getElementById('changeToPortrait')
        // const portrait = window.matchMedia('(orientation: portrait)')

        console.log('landing page')
        loadingScreen.style.display = 'block'
        start.style.display = 'block'
    
        const addXRWeb = () => {
            console.log('clicked start')
            
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
                splashimage.classList.add('hidden')
            }
        
            this.el.sceneEl.addEventListener('realityready', () => {
                console.log('reality ready')
                const waitafew = setTimeout( delaying, 500)
            })
        
            this.el.sceneEl.addEventListener('realityerror', (e) => {
                console.log(e.detail.error)
            })
        }

        start.onclick = addXRWeb
    },
})