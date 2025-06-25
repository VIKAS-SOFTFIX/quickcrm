// QuickCRM Lead Form Embed Script
(function() {
  // Configuration defaults
  const defaultConfig = {
    theme: 'light',
    template: 'default',
    apiKey: null,
    onSubmit: null,
  };

  // Form templates
  const templates = {
    default: `
      <form class="quickcrm-form">
        <div class="quickcrm-form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="quickcrm-form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="quickcrm-form-group">
          <label for="phone">Phone</label>
          <input type="tel" id="phone" name="phone">
        </div>
        <div class="quickcrm-form-group">
          <label for="company">Company</label>
          <input type="text" id="company" name="company">
        </div>
        <div class="quickcrm-form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="3"></textarea>
        </div>
        <button type="submit" class="quickcrm-submit">Submit</button>
      </form>
    `,
    minimal: `
      <form class="quickcrm-form quickcrm-minimal">
        <div class="quickcrm-form-group">
          <input type="text" id="name" name="name" placeholder="Full Name" required>
        </div>
        <div class="quickcrm-form-group">
          <input type="email" id="email" name="email" placeholder="Email" required>
        </div>
        <div class="quickcrm-form-group">
          <textarea id="message" name="message" placeholder="Message" rows="3"></textarea>
        </div>
        <button type="submit" class="quickcrm-submit">Get in Touch</button>
      </form>
    `,
    modern: `
      <form class="quickcrm-form quickcrm-modern">
        <h3>Contact Us</h3>
        <div class="quickcrm-form-row">
          <div class="quickcrm-form-group">
            <input type="text" id="name" name="name" required>
            <label for="name">Full Name</label>
          </div>
          <div class="quickcrm-form-group">
            <input type="email" id="email" name="email" required>
            <label for="email">Email</label>
          </div>
        </div>
        <div class="quickcrm-form-group">
          <input type="tel" id="phone" name="phone">
          <label for="phone">Phone</label>
        </div>
        <div class="quickcrm-form-group">
          <textarea id="message" name="message" rows="3"></textarea>
          <label for="message">Message</label>
        </div>
        <button type="submit" class="quickcrm-submit">Send Message</button>
      </form>
    `,
    classic: `
      <form class="quickcrm-form quickcrm-classic">
        <div class="quickcrm-header">
          <h3>Contact Information</h3>
          <p>Please fill out the form below and we'll get back to you shortly.</p>
        </div>
        <div class="quickcrm-form-group">
          <label for="name">Full Name *</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="quickcrm-form-group">
          <label for="email">Email Address *</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="quickcrm-form-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone">
        </div>
        <div class="quickcrm-form-group">
          <label for="company">Company Name</label>
          <input type="text" id="company" name="company">
        </div>
        <div class="quickcrm-form-group">
          <label for="message">Your Message</label>
          <textarea id="message" name="message" rows="4"></textarea>
        </div>
        <button type="submit" class="quickcrm-submit">Submit Form</button>
      </form>
    `
  };

  // Styles for different themes
  const styles = {
    base: `
      .quickcrm-form {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .quickcrm-form-group {
        margin-bottom: 1rem;
      }
      .quickcrm-form input,
      .quickcrm-form textarea {
        width: 100%;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1.5;
      }
      .quickcrm-submit {
        width: 100%;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
      }
    `,
    light: `
      .quickcrm-form input,
      .quickcrm-form textarea {
        border: 1px solid #ddd;
        background: #fff;
        color: #333;
      }
      .quickcrm-form label {
        color: #555;
      }
      .quickcrm-submit {
        background: #14b8a6;
        color: white;
      }
      .quickcrm-submit:hover {
        background: #0d9488;
      }
    `,
    dark: `
      .quickcrm-form {
        background: #1f2937;
        color: #fff;
      }
      .quickcrm-form input,
      .quickcrm-form textarea {
        border: 1px solid #4b5563;
        background: #374151;
        color: #fff;
      }
      .quickcrm-form label {
        color: #9ca3af;
      }
      .quickcrm-submit {
        background: #14b8a6;
        color: white;
      }
      .quickcrm-submit:hover {
        background: #0d9488;
      }
    `,
    minimal: `
      .quickcrm-minimal input,
      .quickcrm-minimal textarea {
        border: none;
        border-bottom: 2px solid #e5e7eb;
        border-radius: 0;
        padding: 8px 0;
      }
      .quickcrm-minimal input:focus,
      .quickcrm-minimal textarea:focus {
        border-bottom-color: #14b8a6;
        outline: none;
      }
    `,
    modern: `
      .quickcrm-modern {
        background: #fff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
      .quickcrm-modern h3 {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .quickcrm-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .quickcrm-modern .quickcrm-form-group {
        position: relative;
      }
      .quickcrm-modern input,
      .quickcrm-modern textarea {
        border: 2px solid #e5e7eb;
        transition: border-color 0.2s;
      }
      .quickcrm-modern input:focus,
      .quickcrm-modern textarea:focus {
        border-color: #14b8a6;
        outline: none;
      }
      .quickcrm-modern label {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        padding: 0 4px;
        transition: all 0.2s;
      }
      .quickcrm-modern input:focus + label,
      .quickcrm-modern input:not(:placeholder-shown) + label {
        top: 0;
        font-size: 12px;
        color: #14b8a6;
      }
    `,
    classic: `
      .quickcrm-classic {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
      }
      .quickcrm-classic .quickcrm-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .quickcrm-classic h3 {
        margin: 0 0 0.5rem;
        color: #111827;
      }
      .quickcrm-classic p {
        color: #6b7280;
        font-size: 14px;
      }
      .quickcrm-classic label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      .quickcrm-classic input,
      .quickcrm-classic textarea {
        border: 1px solid #d1d5db;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }
    `
  };

  // Initialize the form
  function initLeadForm(config) {
    // Merge config with defaults
    config = { ...defaultConfig, ...config };

    if (!config.apiKey) {
      console.error('QuickCRM: API key is required');
      return;
    }

    // Get container element
    const container = document.getElementById('quickcrm-lead-form');
    if (!container) {
      console.error('QuickCRM: Container element not found');
      return;
    }

    // Add styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles.base + styles[config.theme];
    if (templates[config.template]) {
      styleSheet.textContent += styles[config.template];
    }
    document.head.appendChild(styleSheet);

    // Insert form template
    container.innerHTML = templates[config.template] || templates.default;

    // Add form submission handler
    const form = container.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        // Submit to QuickCRM API
        const response = await fetch('https://api.quickcrm.com/v1/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        const result = await response.json();

        // Call onSubmit callback if provided
        if (typeof config.onSubmit === 'function') {
          config.onSubmit(result);
        }

        // Show success message
        form.innerHTML = `
          <div style="text-align: center; padding: 2rem;">
            <h3 style="color: #059669; margin-bottom: 1rem;">Thank you!</h3>
            <p style="color: #6b7280;">Your message has been received. We'll get back to you shortly.</p>
          </div>
        `;
      } catch (error) {
        console.error('QuickCRM:', error);
        // Show error message
        const submitButton = form.querySelector('.quickcrm-submit');
        submitButton.style.backgroundColor = '#ef4444';
        submitButton.textContent = 'Error submitting form';
      }
    });
  }

  // Expose to global scope
  window.QuickCRM = {
    initLeadForm
  };
})(); 