// QuickCRM Lead Form Embed Script
(function() {
  // Create global QuickCRM object
  window.QuickCRM = window.QuickCRM || {};

  // Default configuration
  const DEFAULT_CONFIG = {
    logoUrl: "https://quickbid.co.in/Assets/Images/logo.png",
    buttonColor: "#10B981",
    type: "lead",
    title: "Contact Us",
    description: "Get in touch with our team"
  };

  // Initialize styles
  const styles = {
    light: {
      background: '#ffffff',
      text: '#111827',
      border: '#e5e7eb'
    },
    dark: {
      background: '#111827',
      text: '#ffffff',
      border: '#374151'
    }
  };

  // Template styles
  const templates = {
    default: {
      spacing: '1rem',
      buttonStyle: ''
    },
    minimal: {
      spacing: '1rem',
      buttonStyle: 'width: 100%;'
    },
    modern: {
      spacing: '1.5rem',
      buttonStyle: 'border-radius: 9999px; padding-left: 2rem; padding-right: 2rem;'
    },
    classic: {
      spacing: '1.25rem',
      buttonStyle: ''
    }
  };

  // Create form container
  function createFormContainer(config) {
    const container = document.createElement('div');
    container.className = 'quickcrm-form-container';
    container.style.padding = '1.5rem';
    container.style.borderRadius = '0.5rem';
    container.style.backgroundColor = styles[config.theme]?.background || styles.light.background;
    container.style.color = styles[config.theme]?.text || styles.light.text;
    container.style.border = `1px solid ${styles[config.theme]?.border || styles.light.border}`;

    // Add logo
    const logoUrl = config.style?.logoUrl || DEFAULT_CONFIG.logoUrl;
    if (logoUrl) {
      const logoContainer = document.createElement('div');
      logoContainer.style.display = 'flex';
      logoContainer.style.justifyContent = 'center';
      logoContainer.style.marginBottom = '1.5rem';

      const logo = document.createElement('img');
      logo.src = logoUrl;
      logo.alt = 'Form Logo';
      logo.style.maxHeight = '4rem';
      logo.style.objectFit = 'contain';
      logo.onerror = () => {
        // If custom logo fails to load, try loading default logo
        if (logoUrl !== DEFAULT_CONFIG.logoUrl) {
          logo.src = DEFAULT_CONFIG.logoUrl;
          logo.onerror = () => {
            logoContainer.style.display = 'none';
          };
        } else {
          logoContainer.style.display = 'none';
        }
      };

      logoContainer.appendChild(logo);
      container.appendChild(logoContainer);
    }

    // Add form title and description
    const titleContainer = document.createElement('div');
    titleContainer.style.textAlign = 'center';
    titleContainer.style.marginBottom = '1.5rem';

    const title = document.createElement('h2');
    title.textContent = config.config?.title || DEFAULT_CONFIG.title;
    title.style.fontSize = '1.25rem';
    title.style.fontWeight = '600';
    title.style.marginBottom = '0.5rem';

    const description = document.createElement('p');
    description.textContent = config.config?.description || DEFAULT_CONFIG.description;
    description.style.color = styles[config.theme]?.text === '#ffffff' ? '#e5e7eb' : '#4b5563';

    titleContainer.appendChild(title);
    titleContainer.appendChild(description);
    container.appendChild(titleContainer);

    return container;
  }

  // Create form field element
  function createField(field) {
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '1rem';

    const label = document.createElement('label');
    label.textContent = field.label;
    if (field.required) {
      const required = document.createElement('span');
      required.textContent = '*';
      required.style.color = '#ef4444';
      required.style.marginLeft = '0.25rem';
      label.appendChild(required);
    }
    wrapper.appendChild(label);

    let input;
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'date':
        input = document.createElement('input');
        input.type = field.type;
        input.placeholder = field.placeholder || '';
        input.required = field.required;
        input.style.width = '100%';
        input.style.padding = '0.5rem';
        input.style.marginTop = '0.25rem';
        input.style.borderRadius = '0.375rem';
        break;

      case 'textarea':
        input = document.createElement('textarea');
        input.placeholder = field.placeholder || '';
        input.required = field.required;
        input.style.width = '100%';
        input.style.padding = '0.5rem';
        input.style.marginTop = '0.25rem';
        input.style.minHeight = '100px';
        input.style.borderRadius = '0.375rem';
        break;

      case 'select':
      case 'multiselect':
        input = document.createElement('select');
        input.required = field.required;
        input.multiple = field.type === 'multiselect';
        if (field.type === 'multiselect') {
          input.size = Math.min(field.options?.length || 4, 4);
        }
        input.style.width = '100%';
        input.style.padding = '0.5rem';
        input.style.marginTop = '0.25rem';
        input.style.borderRadius = '0.375rem';

        if (!field.isMultiple) {
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.textContent = 'Select an option';
          input.appendChild(defaultOption);
        }

        field.options?.forEach(option => {
          const optionEl = document.createElement('option');
          optionEl.value = option;
          optionEl.textContent = option;
          input.appendChild(optionEl);
        });
        break;

      case 'checkbox':
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.display = 'flex';
        checkboxWrapper.style.alignItems = 'center';
        checkboxWrapper.style.marginTop = '0.25rem';

        input = document.createElement('input');
        input.type = 'checkbox';
        input.required = field.required;
        input.style.marginRight = '0.5rem';

        const span = document.createElement('span');
        span.textContent = field.placeholder || field.label;
        span.style.fontSize = '0.875rem';

        checkboxWrapper.appendChild(input);
        checkboxWrapper.appendChild(span);
        wrapper.appendChild(checkboxWrapper);
        return wrapper;

      case 'checkboxes':
        const checkboxesWrapper = document.createElement('div');
        checkboxesWrapper.style.display = 'flex';
        checkboxesWrapper.style.flexDirection = 'column';
        checkboxesWrapper.style.gap = '0.5rem';
        checkboxesWrapper.style.marginTop = '0.25rem';

        field.options?.forEach(option => {
          const optionWrapper = document.createElement('div');
          optionWrapper.style.display = 'flex';
          optionWrapper.style.alignItems = 'center';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.name = field.id;
          checkbox.value = option;
          checkbox.style.marginRight = '0.5rem';

          const optionLabel = document.createElement('span');
          optionLabel.textContent = option;
          optionLabel.style.fontSize = '0.875rem';

          optionWrapper.appendChild(checkbox);
          optionWrapper.appendChild(optionLabel);
          checkboxesWrapper.appendChild(optionWrapper);
        });

        wrapper.appendChild(checkboxesWrapper);
        return wrapper;

      case 'toggle':
        const toggleWrapper = document.createElement('div');
        toggleWrapper.style.display = 'flex';
        toggleWrapper.style.alignItems = 'center';
        toggleWrapper.style.marginTop = '0.25rem';

        const toggleContainer = document.createElement('div');
        toggleContainer.style.position = 'relative';
        toggleContainer.style.width = '2.5rem';
        toggleContainer.style.marginRight = '0.5rem';

        input = document.createElement('input');
        input.type = 'checkbox';
        input.required = field.required;
        input.style.position = 'absolute';
        input.style.width = '1.5rem';
        input.style.height = '1.5rem';
        input.style.backgroundColor = '#ffffff';
        input.style.borderRadius = '9999px';
        input.style.transition = 'all 0.2s';
        input.style.cursor = 'pointer';
        input.style.border = '4px solid #ffffff';

        const toggleLabel = document.createElement('label');
        toggleLabel.style.display = 'block';
        toggleLabel.style.overflow = 'hidden';
        toggleLabel.style.height = '1.5rem';
        toggleLabel.style.borderRadius = '9999px';
        toggleLabel.style.backgroundColor = '#d1d5db';
        toggleLabel.style.cursor = 'pointer';
        toggleLabel.style.transition = 'background-color 0.2s';

        toggleContainer.appendChild(input);
        toggleContainer.appendChild(toggleLabel);

        const toggleText = document.createElement('span');
        toggleText.textContent = field.placeholder || field.label;
        toggleText.style.fontSize = '0.875rem';

        toggleWrapper.appendChild(toggleContainer);
        toggleWrapper.appendChild(toggleText);
        wrapper.appendChild(toggleWrapper);
        return wrapper;

      case 'rating':
        const ratingWrapper = document.createElement('div');
        ratingWrapper.style.display = 'flex';
        ratingWrapper.style.alignItems = 'center';
        ratingWrapper.style.marginTop = '0.25rem';
        ratingWrapper.style.gap = '0.25rem';

        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('button');
          star.type = 'button';
          star.textContent = '★';
          star.style.color = '#d1d5db';
          star.style.cursor = 'pointer';
          star.style.transition = 'color 0.2s';
          star.addEventListener('mouseover', () => {
            star.style.color = '#fbbf24';
          });
          star.addEventListener('mouseout', () => {
            if (!star.classList.contains('selected')) {
              star.style.color = '#d1d5db';
            }
          });
          star.addEventListener('click', () => {
            const stars = ratingWrapper.querySelectorAll('button');
            stars.forEach((s, index) => {
              if (index <= Array.from(stars).indexOf(star)) {
                s.style.color = '#fbbf24';
                s.classList.add('selected');
              } else {
                s.style.color = '#d1d5db';
                s.classList.remove('selected');
              }
            });
          });
          ratingWrapper.appendChild(star);
        }

        wrapper.appendChild(ratingWrapper);
        return wrapper;
    }

    if (input) {
      input.name = field.id;
      input.style.border = '1px solid #e5e7eb';
      wrapper.appendChild(input);
    }

    return wrapper;
  }

  // Initialize form
  window.QuickCRM.initLeadForm = function(config) {
    const container = document.getElementById('quickcrm-lead-form');
    if (!container) return;

    // Merge default config with provided config
    config.style = {
      ...DEFAULT_CONFIG,
      ...config.style
    };

    config.config = {
      type: config.config?.type || DEFAULT_CONFIG.type,
      title: config.config?.title || DEFAULT_CONFIG.title,
      description: config.config?.description || DEFAULT_CONFIG.description
    };

    const form = document.createElement('form');
    form.className = 'quickcrm-form';
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = templates[config.template]?.spacing || templates.default.spacing;

    const formContainer = createFormContainer(config);
    formContainer.appendChild(form);
    container.appendChild(formContainer);

    // Add fields
    config.fields.forEach(field => {
      form.appendChild(createField(field));
    });

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.style.padding = '0.5rem 1rem';
    submitButton.style.marginTop = '1rem';
    submitButton.style.borderRadius = '0.375rem';
    submitButton.style.backgroundColor = config.style.buttonColor;
    submitButton.style.color = '#ffffff';
    submitButton.style.border = 'none';
    submitButton.style.cursor = 'pointer';
    submitButton.style.transition = 'background-color 0.2s';
    
    // Add template-specific button styles
    if (templates[config.template]?.buttonStyle) {
      Object.assign(submitButton.style, templates[config.template].buttonStyle);
    }

    // Add hover effect
    submitButton.addEventListener('mouseenter', () => {
      submitButton.style.backgroundColor = config.style.buttonColor + 'dd';
    });
    submitButton.addEventListener('mouseleave', () => {
      submitButton.style.backgroundColor = config.style.buttonColor;
    });

    form.appendChild(submitButton);

    // Handle form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {
        formType: config.config.type,
        fields: {}
      };
      
      config.fields.forEach(field => {
        if (field.type === 'checkboxes') {
          data.fields[field.id] = Array.from(formData.getAll(field.id));
        } else if (field.type === 'multiselect') {
          data.fields[field.id] = Array.from(form.querySelector(`select[name="${field.id}"]`).selectedOptions).map(opt => opt.value);
        } else {
          data.fields[field.id] = formData.get(field.id);
        }
      });

      if (typeof config.onSubmit === 'function') {
        config.onSubmit(data);
      }
    });
  };
})(); 