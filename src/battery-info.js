export class BatteryInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.batteryInfo;
  }

  getStyles() {
    return `
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: ${this.width}px;
        height: ${this.height}px;
      }

      .battery {
        width: 100%;
        height: 100%;
        color: black;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .battery .battery__head {
        height: ${this.headHeight}px;
        width: 30%;
        background-color: rgb(72, 72, 72);
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
      
      .battery .battery__body {
        background-color: rgb(234, 251, 253);
        border-radius: 12px;
        border: 3px solid grey;
        height: ${this.bodyHeight}px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
      }
      
      .battery__body .charge {
        width: 100%;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        font-size: ${this.height / 8}px;
      }
    `;
  }

  listenLevel() {
    const percentage = Math.round(this.batteryInfo.level * 100)
    const chargeOnPx = this.bodyHeight / 100

    this.chargeLevel.style.height = `${chargeOnPx * percentage}px`;
    this.chargeLevel.textContent = `${percentage}%`;
  }

  listenCharge(event) {
    const isCharging = event.target.charging
    if(isCharging) {
      this.chargeLevel.style.backgroundColor = '#71f47c'
    } else {
      this.chargeLevel.style.backgroundColor = '#FDC1C1'
    }
  }

  getInitialCharge() {
    const percentage = Math.round(this.batteryInfo?.level * 100)
    const chargeOnPx = this.bodyHeight / 100
    
    this.chargeLevel.style.height = `${chargeOnPx * percentage}px`;
    this.chargeLevel.textContent = `${percentage}%`;
    this.chargeLevel.style.backgroundColor = this.batteryInfo.charging ? '#71f47c' : '#d3f471'
  }

  connectedCallback() {
    this.width = this.getAttribute("width")
    this.height = this.getAttribute("height")
    this.headHeight = this.getAttribute("height") / 12
    this.bodyHeight = (this.getAttribute("height") / 12) * 11
    window?.navigator
      ?.getBattery()
      .then((battery) => {
        this.batteryInfo = battery;
        this.render();
      })
      .then(() => {
        this.batteryInfo.addEventListener("levelchange",this.listenLevel.bind(this));
        this.batteryInfo.addEventListener('chargingchange', this.listenCharge.bind(this))
        this.chargeLevel = this.shadowRoot.querySelector('div.charge')
        this.chargeContainer = this.shadowRoot.querySelector('div.battery__body')
        this.getInitialCharge() 
      })
  }

  disconnectedCallback() {
    this.batteryInfo.removeEventListener("levelchange",this.listenLevel.bind(this))
    this.batteryInfo.removeEventListener("chargingchange", this.listenCharge.bind(this))
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>${this.getStyles()}</style>
        <div class="battery">
            <div class="battery__head"></div>
            <div class="battery__body">
                <div class="charge"></div>
            </div>
        </div>
        <slot name="footer"></slot>
    `;
  }
}

customElements.define("battery-info", BatteryInfo);
