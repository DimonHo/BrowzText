document.addEventListener('DOMContentLoaded', function() {
  // 工具切换功能
  const toolTabs = document.querySelectorAll('.tool-tab');
  const toolPanels = document.querySelectorAll('.tool-panel');
  
  toolTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTool = this.getAttribute('data-tool');
      
      // 更新标签状态
      toolTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // 显示对应工具面板
      toolPanels.forEach(panel => {
        panel.classList.add('hidden');
      });
      document.getElementById(targetTool + '-tool').classList.remove('hidden');
    });
  });
  
  // 文本转义工具功能
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const escapeBtn = document.getElementById('escape-btn');
  const unescapeBtn = document.getElementById('unescape-btn');
  
  // 获取选中的转义符号
  function getSelectedEscapeChars() {
    const checkboxes = document.querySelectorAll('#escape-tool input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
  }
  
  // 转义函数
  function escapeText(text, chars) {
    if (!chars.length) {
      showNotification('请至少选择一个要转义的符号！', 'warning');
      return text;
    }
    
    let result = text;
    
    // 按特定顺序转义，避免重复转义
    if (chars.includes('\\')) {
      result = result.replace(/\\/g, '\\\\');
    }
    if (chars.includes('"')) {
      result = result.replace(/"/g, '\\"');
    }
    if (chars.includes("'")) {
      result = result.replace(/'/g, "\\'");
    }
    if (chars.includes('\\n')) {
      result = result.replace(/\n/g, '\\n');
    }
    if (chars.includes('\\t')) {
      result = result.replace(/\t/g, '\\t');
    }
    
    return result;
  }
  
  // 去转义函数
  function unescapeText(text, chars) {
    if (!chars.length) {
      showNotification('请至少选择一个要去转义的符号！', 'warning');
      return text;
    }
    
    let result = text;
    
    // 按相反顺序去转义
    if (chars.includes('\\t')) {
      result = result.replace(/\\t/g, '\t');
    }
    if (chars.includes('\\n')) {
      result = result.replace(/\\n/g, '\n');
    }
    if (chars.includes("'")) {
      result = result.replace(/\\'/g, "'");
    }
    if (chars.includes('"')) {
      result = result.replace(/\\"/g, '"');
    }
    if (chars.includes('\\')) {
      result = result.replace(/\\\\/g, '\\');
    }
    
    return result;
  }
  
  // 转义按钮事件
  escapeBtn.addEventListener('click', function() {
    const text = inputText.value;
    const chars = getSelectedEscapeChars();
    const result = escapeText(text, chars);
    outputText.value = result;
    showNotification('文本转义完成！', 'success');
  });
  
  // 去转义按钮事件
  unescapeBtn.addEventListener('click', function() {
    const text = inputText.value;
    const chars = getSelectedEscapeChars();
    const result = unescapeText(text, chars);
    outputText.value = result;
    showNotification('文本去转义完成！', 'success');
  });
  
  // 多行文本处理工具功能
  const multilineInput = document.getElementById('multiline-input');
  const multilineOutput = document.getElementById('multiline-output');
  const processMultilineBtn = document.getElementById('process-multiline-btn');
  const clearMultilineBtn = document.getElementById('clear-multiline-btn');
  
  // 处理多行文本
  function processMultilineText() {
    const text = multilineInput.value.trim();
    if (!text) {
      showNotification('请输入要处理的文本！', 'warning');
      return;
    }
    
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const quoteType = document.querySelector('input[name="quote-type"]:checked').value;
    const outputFormat = document.querySelector('input[name="output-format"]:checked').value;
    
    const quote = quoteType === 'double' ? '"' : "'";
    
    let result;
    if (outputFormat === 'multiline') {
      // 多行格式：每行一个引号包裹的字符串，末尾加逗号
      result = lines.map((line, index) => {
        const quotedLine = quote + line.trim() + quote;
        return index === lines.length - 1 ? quotedLine : quotedLine + ',';
      }).join('\n');
    } else {
      // 单行格式：所有字符串用逗号连接在一行
      result = lines.map(line => quote + line.trim() + quote).join(',');
    }
    
    multilineOutput.value = result;
    showNotification('多行文本处理完成！', 'success');
  }
  
  // 清空多行文本
  function clearMultilineText() {
    multilineInput.value = '';
    multilineOutput.value = '';
    showNotification('已清空文本！', 'info');
  }
  
  // 多行文本处理按钮事件
  processMultilineBtn.addEventListener('click', processMultilineText);
  clearMultilineBtn.addEventListener('click', clearMultilineText);
  
  // 输出框点击复制功能
  outputText.addEventListener('click', function() {
    if (this.value) {
      this.select();
      document.execCommand('copy');
      showNotification('结果已复制到剪贴板！', 'success');
    }
  });
  
  multilineOutput.addEventListener('click', function() {
    if (this.value) {
      this.select();
      document.execCommand('copy');
      showNotification('结果已复制到剪贴板！', 'success');
    }
  });
  
  // 快捷键支持
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey) {
      const activePanel = document.querySelector('.tool-panel:not(.hidden)');
      
      if (activePanel.id === 'escape-tool') {
        if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          escapeBtn.click();
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          unescapeBtn.click();
        } else if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          toggleAllCheckboxes();
        }
      } else if (activePanel.id === 'multiline-tool') {
        if (e.key === 'Enter') {
          e.preventDefault();
          processMultilineBtn.click();
        }
      }
    }
  });
  
  // 全选/取消全选复选框
  function toggleAllCheckboxes() {
    const checkboxes = document.querySelectorAll('#escape-tool input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(cb => {
      cb.checked = !allChecked;
    });
    
    showNotification(allChecked ? '已取消全选' : '已全选所有符号', 'info');
  }
  
  // 通知函数
  function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    // 根据类型设置颜色
    switch (type) {
      case 'success':
        notification.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        break;
      case 'warning':
        notification.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
        break;
      case 'error':
        notification.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
        break;
      default:
        notification.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
      }
    }, 3000);
  }
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});

