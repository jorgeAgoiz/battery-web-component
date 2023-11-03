class BatteryInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.batteryInfo;
  }

  getStyles() {
    return `
    .battery {
        width: ${this.width}px;
        height: ${this.height}px;
        color: black;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .battery .battery__head {
        height: 20px;
        width: 40px;
        background-color: rgb(72, 72, 72);
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
      
      .battery .battery__body {
        background-color: rgb(242, 207, 161);
        border-radius: 12px;
        border: 3px solid grey;
        height: 334px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
      }
      
      .battery__body .battery__charge {
        width: 100%;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
      }
    `;
  }

  listenLevel() {
    const percentage = Math.round(this.batteryInfo.level * 100)
    this.chargeLevel.style.height = `${3.34 * percentage}px`;
    this.chargeLevel.textContent = `${percentage}%`;
  }

  listenCharge(event) {
    const isCharging = event.target.charging
    if(isCharging) {
      this.chargeLevel.style.backgroundColor = '#71f47c'
    } else {
      this.chargeLevel.style.backgroundColor = '#d3f471'
    }
  }

  getInitialCharge() {
    const percentage = Math.round(this.batteryInfo?.level * 100)
    this.chargeLevel.style.height = `${3.34 * percentage}px`;
    this.chargeLevel.textContent = `${percentage}%`;
    this.chargeLevel.style.backgroundColor = this.batteryInfo.charging ? '#71f47c' : '#d3f471'
  }

  connectedCallback() {
    this.width = this.getAttribute("width")
    this.height = this.getAttribute("height")
    window?.navigator
      ?.getBattery()
      .then((battery) => {
        this.batteryInfo = battery;
        this.render();
      })
      .then(() => {
        this.batteryInfo.addEventListener("levelchange",this.listenLevel.bind(this));
        this.batteryInfo.addEventListener('chargingchange', this.listenCharge.bind(this))
        this.chargeLevel = this.shadowRoot.querySelector('div.battery__charge')
        this.chargeContainer = this.shadowRoot.querySelector('div.battery__body')
        this.getInitialCharge()
      });
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
                <div class="battery__charge"></div>
            </div>
        </div>
        <slot name="footer"></slot>
    `;
  }
}

customElements.define("battery-info", BatteryInfo);
