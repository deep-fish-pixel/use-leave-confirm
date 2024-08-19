export default function (options: {
  confirm?: () => void,
  cancel?: () => void,
	contentText: string,
	confirmText: string,
	cancelText: string,
}) {
  const confirmEl = document.createElement('div');

  confirmEl.setAttribute('class', 'lc-dialog');
  confirmEl.setAttribute('style', 'z-index: 9999;');
  confirmEl.innerHTML = `
    <div class="lc-dialog__mask"></div>
    <div class="lc-dialog__container">
      <div class="lc-dialog__inner">
        <div class="lc-dialog__icon-box">
          <i class="lc-icon lc-icon_warning"></i>
        </div>
        <div class="lc-dialog__main">
          <div class="lc-dialog__body">${options.contentText}</div>
          <div class="lc-dialog__footer">
            <div class="lc-dialog__default-footer">
              <button class="lc-button lc-button--normal lc-button--plain" type="button">
                <div class="lc-button__content">${options.cancelText}</div>
              </button>
              <button class="lc-button lc-button--primary" type="button">
                <div class="lc-button__content">${options.confirmText}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
   `;

  document.body.append(confirmEl);

  const normalButton = confirmEl.querySelector('.lc-button--normal');
  const primaryButton = confirmEl.querySelector('.lc-button--primary');

  function close() {
    document.body.removeChild(confirmEl);
    if(normalButton) {
      normalButton.removeEventListener('click', cancelHandle)
    }
    if(primaryButton) {
      primaryButton.removeEventListener('click', confirmHandle)
    }
  }
  const cancelHandle = () => {
    if(options.cancel) {
      options.cancel();
    }
    close();
  }
  const confirmHandle = () => {
    if(options.confirm) {
      options.confirm();
    }
    close();
  }

  return {
    show(){
      confirmEl.style.display = 'block';
      if(normalButton) {
        normalButton.addEventListener('click', cancelHandle)
      }
      if(primaryButton) {
        primaryButton.addEventListener('click', confirmHandle)
      }

      setTimeout(() => {
        confirmEl.setAttribute('class', confirmEl.getAttribute('class') + ' lc-dialog-show');
      }, 10);
    },
    close(){
      close();
    },
    cancel(){
      close();
    },
    confirm(){
      confirmHandle();
    }
  };
}
