declare global {
    interface HTMLElement {
      disable(): void
      enable(): void
      display(status: boolean): void
      hide(): void
      show(): void
      removeChildren(): void
    }

    interface HTMLInputElement {
      addEnterKeyListener(task: (element: HTMLInputElement, event: Event) => void): void
    }
  }
  
  HTMLElement.prototype.disable = function(): void {
    this.setAttribute("disabled", "disabled")
  }
  
  HTMLElement.prototype.enable = function(): void {
    this.removeAttribute("disabled")
  }
  
  HTMLElement.prototype.display = function(status: boolean): void {
    if (status) {
      this.style.removeProperty("display")
    } else {
      this.style.setProperty("display", "none")
    }
  }

  HTMLElement.prototype.hide = function(): void {
    this.classList.remove("d-block")
  }
  
  HTMLElement.prototype.show = function(): void {
    this.classList.add("d-block")
  }
  
  HTMLElement.prototype.removeChildren = function(): void {
    while(this.lastChild) {
      this.removeChild(this.lastChild)
    }
  }

  HTMLInputElement.prototype.addEnterKeyListener = function(task: (element: HTMLInputElement, event: Event) => void): void {
    this.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.keyCode == 13) {
        event.preventDefault()
        task(this, event)
      }
    })
  }

  export {}
