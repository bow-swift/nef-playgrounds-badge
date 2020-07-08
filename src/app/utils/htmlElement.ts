declare global {
    interface HTMLElement {
      disable(): void
      enable(): void
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

  HTMLInputElement.prototype.addEnterKeyListener = function(task: (element: HTMLInputElement, event: Event) => void): void {
    this.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.keyCode == 13) {
        event.preventDefault()
        task(this, event)
      }
    })
  }

  export {}
