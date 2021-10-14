export enum RenderType {
  NONE="none",
}

export enum Quality {
  LOW="low", MEDIUM="medium", HIGH="high",
}

export class Controller {
  nav;
  renderType = RenderType.NONE;
  quality = Quality.HIGH;
  qualityCb: (q: Quality) => void;
  addRootCb: () => void;
  removeRootCb: () => void;

  constructor() {
    this.nav = document.querySelector<HTMLElement>('nav');

    // Open and close panel buttons
    document.querySelector<HTMLButtonElement>('#close')
      .addEventListener('click', () => this.nav.classList.remove('visible'));
    document.querySelector<HTMLButtonElement>('#open')
      .addEventListener('click', () => this.nav.classList.add('visible'));

    // Post processing effect
    // const radiosRenderType = document.querySelectorAll<HTMLInputElement>('input[type="radio"][name="renderType"]');
    // radiosRenderType.forEach(radio => {
    //   radio.addEventListener('change', (e: any) => this.handleChangeRenderType(e.target.value));
    //   if (radio.checked) {
    //     this.handleChangeRenderType(radio.value as RenderType);
    //   }
    // });

    // Roots buttons
    document.querySelector<HTMLButtonElement>('button#add-root')
      .addEventListener('click', () => this.handleAddRoot());
    document.querySelector<HTMLButtonElement>('button#remove-root')
      .addEventListener('click', () => this.handleRemoveRoot());

    // Quality
    const radiosQuality = document.querySelectorAll<HTMLInputElement>('input[type="radio"][name="quality"]');
    radiosQuality.forEach(radio => {
      radio.addEventListener('change', (e: any) => this.handleChangeQuality(e.target.value));
      if (radio.checked) {
        this.handleChangeQuality(radio.value as Quality)
      }
    });
  }

  handleChangeRenderType(type: RenderType) {
    this.renderType = type;
  }

  handleChangeQuality(type: Quality) {
    this.quality = type;
    if (this.qualityCb) {
      this.qualityCb(this.quality);
    }
  }

  handleAddRoot() {
    if (this.addRootCb) {
      this.addRootCb();
    }
  }

  handleRemoveRoot() {
    if (this.removeRootCb) {
      this.removeRootCb();
    }
  }

  onChangeQuality(f: any) { this.qualityCb = f; }
  onAddRoot(f: any) { this.addRootCb = f; }
  onRemoveRoot(f: any) { this.removeRootCb = f; }
}

export function initControlPanel() {
  return new Controller();
}