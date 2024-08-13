const style = document.createElement('style');

style.setAttribute('type', 'text/css');
style.innerHTML = `
.lc-dialog {
  position: relative;
  z-index: 9999;
  display: none;
}
.lc-dialog__mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba( 0, 0, 0 , .7 );
  opacity: 0;
  transition: opacity 0.3s;
}
.lc-dialog-show .lc-dialog__mask{
  opacity: 1;
}
.lc-dialog__container {
  position: fixed;
  right: 0;
  left: 0;
  display: flex;
  max-width: 92%;
  max-height: 84%;
  margin: 0 auto;
  padding: 24px;
  background: rgb( 255, 255, 255 );
  border-radius: 4px;
  box-shadow: 0 3px 6px -4px rgba( 0, 0, 0 , 10%), 0 6px 16px 0 rgba( 0, 0, 0 , 6%), 0 9px 28px 8px rgba( 0, 0, 0 , 3%);
  width: 420px;
  max-height: 50%;
  top: 50%;
  opacity: 0.5;
  transform: translateY(-50%) scale(0.5);
  transition: all 0.3s;
}
.lc-dialog-show .lc-dialog__container{
  transform: translateY(-50%) scale(1);
  opacity: 1;
}
.lc-dialog__inner {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
}
.lc-dialog__icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  margin-right: 12px;
}
.lc-dialog__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
.lc-dialog__body {
  flex: 1;
  margin-inline: calc(0px - 24px);
  padding-inline: 24px;
  overflow: auto;
}
.lc-dialog__footer {
  flex: none;
  margin-top: 24px;
}
.lc-dialog__default-footer {
  text-align: right;
}
.lc-dialog__default-footer .lc-button{
  margin-left: 16px;
}
.lc-dialog__default-footer .lc-button:first-child{
  margin-left: 0;
}
.lc-button {
  display: inline-flex;
  grid-column-gap: 4px;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
  line-height: 1.5;
  white-space: nowrap;
  vertical-align: middle;
  border: 1px solid rgba(0,0,0,0);
  border-radius: 4px;
  cursor: pointer;
  transition: all .3s;
  color: #fff;
  background: #02b3be;
  border-color: rgba(0,0,0,0);
  outline: none;
}
.lc-button.lc-button--primary {
  border-color: #02b3be;
  outline: none;
}
.lc-button.lc-button--primary:active {
  background: #087d85;
  border-color: #087d85;
}
.lc-button--plain.lc-button--normal:not(.is-ghost) {
  color: rgb( 4, 11, 41 );
  background: #fff;
  border-color: rgb( 206, 208, 216 );
  outline: none;
}
.lc-button--plain.lc-button--normal:not(.is-ghost):active {
  background: #ddd;
}
`;

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
          <i class="lc-icon lc-icon_warning_filled lc-dialog__icon"
                                           style="font-size: 22px; color: rgb(253, 167, 28);"></i>
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

  if(!style.parentElement){
    document.head.append(style);
  }

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
