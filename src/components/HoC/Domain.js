import React from 'react'
import Domain from '../../js-training/'

const domain = new Domain()

const withDomain = WrappedComponent => props => (
  <WrappedComponent {...props} domain={domain} />
)

const withDomainService = serviceName => WrappedComponent =>
  withDomain(
    class WithDomainService extends React.Component {
      state = { service: null }
      async componentDidMount() {
        const service = await this.props.domain.get(serviceName)
        this.setState({ service })
      }
      render() {
        const { domain, ...props } = this.props
        const { service } = this.state
        const newProps = { ...props, [serviceName]: service }

        return service ? <WrappedComponent {...newProps} /> : null
      }
    }
  )

const withServiceResponse = (serviceName, params) => WrappedComponent =>
  withDomainService(serviceName)(
    class WithServiceResponse extends React.Component {
      state = { response: null }
      async componentDidMount() {
        const response = await this.props[serviceName].execute(params)
        this.setState({ response })
      }
      render() {
        const { sercice, ...props } = this.props
        const { response } = this.state
        const newProps = { ...props, [serviceName]: response }

        return typeof response !== 'undefined' ? (
          <WrappedComponent {...newProps} />
        ) : null
      }
    }
  )

export { withDomain, withDomainService, withServiceResponse }