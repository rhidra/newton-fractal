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
  iterations = 20;
  qualityCb: (q: Quality) => void;
  iterCb: (i: number) => void;
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
    
    // Iteration buttons
    document.querySelector<HTMLButtonElement>('button#add-iter')
      .addEventListener('click', () => this.handleAddIter());
    document.querySelector<HTMLButtonElement>('button#remove-iter')
      .addEventListener('click', () => this.handleRemoveIter());

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

  handleAddRoot() { this.addRootCb ? this.addRootCb() : null; }
  handleRemoveRoot() { this.removeRootCb ? this.removeRootCb() : null; }

  handleAddIter() { 
    this.iterations++;
    document.querySelector('span#iterations-number').innerHTML = `${this.iterations}`;
    this.iterCb ? this.iterCb(this.iterations) : null; 
  }
  handleRemoveIter() { 
    this.iterations = this.iterations === 1 ? this.iterations : this.iterations - 1;
    document.querySelector('span#iterations-number').innerHTML = `${this.iterations}`;
    this.iterCb ? this.iterCb(this.iterations) : null;
  }

  onChangeQuality(f: any) { this.qualityCb = f; }
  onAddRoot(f: any) { this.addRootCb = f; }
  onRemoveRoot(f: any) { this.removeRootCb = f; }
  onChangeIterations(f: any) { this.iterCb = f; }
}

export function initControlPanel() {
  return new Controller();
}