import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import CustomerProfileView from "../../Views/Account/CustomerProfileView.vue";

describe("CustomerProfileView", () => {
  it("muestra un error y no guarda si un campo obligatorio está vacío", async () => {
    const wrapper = mount(CustomerProfileView);

    await flushPromises();

    wrapper.vm.form.nombre = "";

    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.errores.nombre).toBeTruthy();
    expect(wrapper.text()).toContain("El nombre es obligatorio");
  });

  it("guarda correctamente cuando todos los campos obligatorios están rellenos", async () => {
    const wrapper = mount(CustomerProfileView);
    wrapper.vm.form.nombre = "Ana";
    wrapper.vm.form.apellidos = "García";
    wrapper.vm.form.email = "ana@example.com";
    wrapper.vm.form.direccion = "Calle Mayor 1";
    wrapper.vm.form.codigoPostal = "33001";
    wrapper.vm.form.ciudad = "Oviedo";
    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(Object.keys(wrapper.vm.errores)).toHaveLength(0);
  });

  it("muestra un aviso si el navegador no soporta reconocimiento de voz", async () => {
    const original = window.SpeechRecognition;
    const originalWebkit = window.webkitSpeechRecognition;

    window.SpeechRecognition = undefined;
    window.webkitSpeechRecognition = undefined;

    const wrapper = mount(CustomerProfileView);

    await wrapper
      .find('button[aria-label="Dictar ciudad por voz"]')
      .trigger("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.avisoVoz).toContain("no soporta");

    window.SpeechRecognition = original;
    window.webkitSpeechRecognition = originalWebkit;
  });
});