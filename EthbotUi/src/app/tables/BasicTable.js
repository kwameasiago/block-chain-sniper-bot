import React, { Component } from 'react'


export class BasicTable extends Component {
  etherList = []
  state = {
    list: [],
    count: 0,
    status: 'Connection is ok'
  }

  componentDidMount() {
    let recipient = localStorage.getItem('Recipient');
    let mnenomic = localStorage.getItem('Mnenomics');
    let query = '';
    if (this.props.checkLogin) {
      console.log(query)
      const source = new EventSource(`http://localhost:8080?recipient=${recipient}&&mnenomics=${mnenomic}`);
      source.onopen = function (event) {
        // console.log('opended connection')
      }
      source.onmessage = (event) => {
        this.etherList = this.etherList.concat([JSON.parse(event.data)])
        this.setState({
          ...this.state,
          list: this.etherList,
          count: this.count + 1
        })
      }

      source.onerror = (error) => {
        console.log('error', error)
        this.setState({
          ...this.state,
          status: 'Error: Confirm you have  the correct mnenomic and recipient address'
        })
      }
    }

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      console.log(this.state.list)
    }
  }

  renderTable() {
    return this.state.list.map((x, index) => {
      return (
        <tr key={index}>
          <td>{x.token0}</td>
          <td>{x.token1}</td>
          <td className="text-danger"> {x.pairAddress} <i className="mdi mdi-arrow-down"></i></td>
          <td><label className="badge badge-danger">{x.time}</label></td>
        </tr>
      )
    })
  }

  render() {
    let mn = localStorage.getItem('Mnenomics') ? localStorage.getItem('Mnenomics').slice(0, 28) + '...' : 'Not set';
    let rc = localStorage.getItem('Recipient') ? localStorage.getItem('Recipient').slice(0, 28) + '...' : 'Not set';
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Basic Crypto alert</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Tables</a></li>
              <li className="breadcrumb-item active" aria-current="page">Basic tables</li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{this.state.status}</h4>
                <p className="card-description"> {`menenmics [${mn}]`} <code>{`recipient [${rc}]`}</code>
                </p>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Token 0</th>
                        <th>Token 1</th>
                        <th>Pair address</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTable()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default BasicTable
