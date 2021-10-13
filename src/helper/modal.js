export const openModal = (id) => {
  const el = document.getElementById(id);
  if (el) {
    new bootstrap.Modal(el).show();
  }
};

export const closeModal = (id) => {
  const el = document.getElementById(id);
  if (el) {
    const modal = bootstrap.Modal.getInstance(el);
    if (modal) {
      modal.hide();
    } else {
      new bootstrap.Modal(el).hide();
    }
  }
};