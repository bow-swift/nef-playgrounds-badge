declare global {
    interface HTMLElement {
      disable(): void
      enable(): void
      hide(): void
      show(): void
      removeChildren(): void
    }
  }
  
  HTMLElement.prototype.disable = function(): void {
    this.setAttribute("disabled", "disabled")
  }
  
  HTMLElement.prototype.enable = function(): void {
    this.removeAttribute("disabled")
  }
  
  HTMLElement.prototype.hide = function(): void {
    this.style.setProperty("display", "none")
  }
  
  HTMLElement.prototype.show = function(): void {
    this.style.removeProperty("display")
  }
  
  HTMLElement.prototype.removeChildren = function(): void {
    while(this.lastChild) {
      this.removeChild(this.lastChild)
    }
  }

  export {}
