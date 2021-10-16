export enum RenderType {
  ROOT="root", DISTANCE="distance", 
  STEPS_1="steps1", STEPS_2="steps2", STEPS_3="steps3",
  FUNCTION="function",
}

export enum Quality {
  LOW="low", MEDIUM="medium", HIGH="high",
}

export class Controller {
  nav;
  _renderType = RenderType.ROOT;
  renderGrid = true;
  showFunction = false;
  quality = Quality.HIGH;
  iterations = 20;
  qualityCb: (q: Quality) => void;
  iterCb: (i: number) => void;
  addRootCb: () => void;
  removeRootCb: () => void;
  renderTypeCb: (type: RenderType) => void;
  renderGridCb: (b: boolean) => void;

  constructor() {
    this.nav = document.querySelector<HTMLElement>('nav');

    // Open and close panel buttons
    document.querySelector<HTMLButtonElement>('#close')
      .addEventListener('click', () => this.nav.classList.remove('visible'));
    document.querySelector<HTMLButtonElement>('#open')
      .addEventListener('click', () => this.nav.classList.add('visible'));

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

    // Post processing effect
    const radiosRenderType = document.querySelectorAll<HTMLInputElement>('input[type="radio"][name="renderType"]');
    radiosRenderType.forEach(radio => {
      radio.addEventListener('change', (e: any) => this.handleChangeRenderType(e.target.value));
      if (radio.checked) {
        this.handleChangeRenderType(radio.value as RenderType);
      }
    });

    // Other debug features
    document.querySelector<HTMLInputElement>('input#grid')
      .addEventListener('change', (e: any) => this.handleChangeRenderGrid(e.target.checked));
    document.querySelector<HTMLInputElement>('input#function')
      .addEventListener('change', (e: any) => this.handleShowFunction(e.target.checked));

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
    this._renderType = type;
    this.renderTypeCb ? this.renderTypeCb(type) : null;
  }

  get renderType() {
    return this.showFunction ? RenderType.FUNCTION : this._renderType;
  }

  handleChangeRenderGrid(render: boolean) {
    this.renderGrid = render;
    this.renderGridCb ? this.renderGridCb(render) : null;
  }

  handleShowFunction(show: boolean) {
    this.showFunction = show;
    this.renderTypeCb ? this.renderTypeCb(show ? RenderType.FUNCTION : this._renderType) : null;
  }

  handleChangeQuality(type: Quality) {
    this.quality = type;
    this.qualityCb ? this.qualityCb(this.quality) : null;
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
  onChangeRenderType(f: any) { this.renderTypeCb = f; }
  onChangeRenderGrid(f: any) { this.renderGridCb = f; }
}

export function initControlPanel() {
  return new Controller();
}