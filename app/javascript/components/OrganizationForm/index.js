import React from 'react'
import { Field } from 'redux-form'
import R from 'ramda'

import Callout from 'components/Callout'
import LocationField from 'components/LocationField'

import s from './main.css'

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const formatGraphQLErrors = errors =>
  R.map(
    ([field, errors]) => (
      <span key={`${field}-error`}>
        <strong>{capitalize(field)}</strong>: {errors.join(', ')}
        <br />
      </span>
    ),
    R.toPairs(errors)
  )

const renderFieldHelper = ({ input, type, label, className, selectOptions }) => {
  switch (type) {
    case 'input':
    case 'text':
      return <input {...input} type={type} className={className} />
    case 'textarea':
      return <textarea {...input} type={type} className={className} />
    case 'select':
      return (
        <select {...input} className={className}>
          {selectOptions}
        </select>
      )
    default:
      return <Callout type="error" />
  }
}

const renderField = props => {
  const { input, label, type, Custom, meta: { touched, error, warning }, className, required } = props
  const fieldInput = renderFieldHelper({ input, type, label, className, selectOptions: props.children })
  return (
    <div>
      <label className={s.label}>
        {label} <span className={s.errorMsg}>{touched && error ? error : '*'}</span>
      </label>
      <div>{Custom ? <Custom {...props} /> : fieldInput}</div>
    </div>
  )
}

const isNoErrors = errors => R.isNil(errors) || R.isEmpty(errors)

const OrganizationForm = ({ handleSubmit, disableSubmit, errors }) => (
  <form className={s.form} onSubmit={handleSubmit}>
    {isNoErrors(errors) ? null : <Callout type="error" message={formatGraphQLErrors(errors)} />}
    <div className={s.inputGroup}>
      <Field label="Name" className={s.field} name="name" component={renderField} type="text" />
    </div>
    <div className={s.inputGroup}>
      <Field label="Description" className={s.textfield} name="description" component={renderField} type="textarea" />
    </div>
    <div className={s.inputGroup}>
      <Field
        label="Location"
        className={s.field}
        name="location"
        component={renderField}
        Custom={LocationField}
        type="text"
      />
    </div>
    <div className={s.inputGroup}>
      <Field label="Website" className={s.field} name="website" component={renderField} type="text" />
    </div>
    <div className={s.inputGroup}>
      <button className={`${s.btn} ${s.primary}`} type="submit" disabled={disableSubmit}>
        Save
      </button>
    </div>
  </form>
)

export default OrganizationForm
