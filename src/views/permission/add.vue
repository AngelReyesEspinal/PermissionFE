<template>
  <div>
    <b-card
      border-variant="dark"
      header="Dark"
      header-bg-variant="dark"
      header-text-variant="white"
      header-tag="header"
    >
      <template #header>
        <h6 class="mb-0">Add permission</h6>
      </template>
      <b-form @submit.stop.prevent="validate" @reset.prevent="onReset">
        <b-form-group
          id="input-group-1"
          label="Name"
          label-for="employeeFirstName"
        >
          <b-form-input
            id="employeeFirstName"
            type="text"
            name="employeeFirstName"
            v-model="model.employeeFirstName"
            placeholder="Required*"
            v-validate="{ required: true }"
            :state="validateState('employeeFirstName')"
            aria-describedby="employeeFirstName-feedback"
            data-vv-as="Name"
          ></b-form-input>
          <b-form-invalid-feedback id="employeeFirstName-feedback">{{
            veeErrors.first("employeeFirstName")
          }}</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Lastname"
          label-for="employeeLastName"
        >
          <b-form-input
            id="employeeLastName"
            type="text"
            name="employeeLastName"
            v-model="model.employeeLastName"
            placeholder="Required*"
            v-validate="{ required: true }"
            :state="validateState('employeeLastName')"
            aria-describedby="employeeLastName-feedback"
            data-vv-as="Lastname"
          ></b-form-input>
          <b-form-invalid-feedback id="employeeLastName-feedback">{{
            veeErrors.first("employeeLastName")
          }}</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="input-group-3"
          label="Permission type"
          label-for="permissionTypeId"
        >
          <b-form-select
            id="permissionTypeId"
            name="permissionTypeId"
            v-model="model.permissionTypeId"
            :options="types"
            v-validate="{ required: true }"
            :state="validateState('permissionTypeId')"
            aria-describedby="permissionTypeId-feedback"
            data-vv-as="Permission type"
          ></b-form-select>
          <b-form-invalid-feedback id="permissionTypeId-feedback">{{
            veeErrors.first("permissionTypeId")
          }}</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="input-group-4"
          label="Permission application date"
          label-for="permissionDate"
        >
          <b-form-datepicker
            id="permissionDate"
            v-model="model.permissionDate"
            class="mb-2"
            name="permissionDate"
            v-validate="{ required: true }"
            :state="validateState('permissionDate')"
            aria-describedby="permissionDate-feedback"
            data-vv-as="Permission application date"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            locale="es"
          ></b-form-datepicker>
          <b-form-invalid-feedback id="permissionDate-feedback">{{
            veeErrors.first("permissionDate")
          }}</b-form-invalid-feedback>
        </b-form-group>
        <b-button @click="backToList" type="button">Cancel</b-button>
        <b-button type="submit" class="float-right" variant="success"
          >Save</b-button
        >
        <b-button class="cancel-btn float-right" type="reset" variant="danger"
          >Reset</b-button
        >
      </b-form>
    </b-card>
  </div>
</template>

<script lang="ts">
import Permission from "@/models/permission.model";
import PermissionService from "../../services/permission.service";
import { Component, Vue } from "vue-property-decorator";
import PermissionTypeService from "@/services/permission-type.service";
import PermissionType from "@/models/permission-type.model";
import { AxiosResponse } from "axios";
import SelectItem from "@/core/models/select-item.model";
import HttpStatusCode  from '@/core/utils/http-status-code';

@Component({})
export default class PermissionAdd extends Vue {
  service = new PermissionService();
  permissionTypeService = new PermissionTypeService();
  saving = false;
  model = new Permission();
  permissionTypes: PermissionType[] = [];
  created() {
    this.getPermissionTypes();
  }
  onReset() {
    this.model = new Permission();
    this.$nextTick(() => this.$validator.reset());
  }
  get types() {
    let data = this.permissionTypes.map((x) => new SelectItem(x.id, x.description));
    data.unshift(new SelectItem(null, "Select a permission type"));
    return data;
  }
  async getPermissionTypes() {
    this.permissionTypes = await this.permissionTypeService.get();
  }

  async validate() {
    const result = await this.$validator.validateAll();
    if (result) this.add();
    this.$validator.errors.items.forEach((error) => {
      this.$bvToast.toast(error.msg, {
        title: `Error de validación`,
        variant: "danger",
        solid: true,
      });
    });
  }
  async add() {
    try {
      this.saving = true;
      await this.service.add(this.model);
      this.onReset();
      this.backToList();
    } catch (errors: any) {
      const response = errors.response as AxiosResponse<any>;
      if (response && response.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
        response.data.forEach((error: any) => {
          this.$bvToast.toast(error.errorMessage, {
            title: `Error de validación`,
            variant: "danger",
            solid: true,
          });
        });
      }
    } finally {
      this.saving = false;
    }
  }
  backToList() {
    this.$router.push(`/`);
  }
  validateState(ref: string) {
    let self = this as any;
    const dirty = self?.veeFields[ref]?.dirty;
    const validated = self?.veeFields[ref]?.validated;
    const hasContextToValidate = self.veeFields[ref] && (dirty || validated);
    return hasContextToValidate ? !self.veeErrors.has(ref) : null;
  }
}
</script>
<style>
.cancel-btn {
  margin-right: 5px;
}
</style>