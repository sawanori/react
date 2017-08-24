import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'

class BBSForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      body: ''
    }
  }
  // テキストボックスの値が変化した時の処理
  nameChanged (e) {
    this.setState({name: e.target.value})
  }
  bodyChanged (e) {
    this.setState({body: e.target.value})
  }
  // Webサーバに対して書き込みを投稿する --- (*2)
  post (e) {
    request
      .get('/api/write')
      .query({
        name: this.state.name,
        body: this.state.body
      })
      .end((err, data) => {
        if (err) {
          console.error(err)
        }
        this.setState({body: ''})
        if (this.props.onPost) {
          this.props.onPost()
        }
      })
  }
  render () {
    return (
      <div >
        名前:<br />
        <input type='text' value={this.state.name}
          onChange={e => this.nameChanged(e)} /><br />
        本文:<br />
        <input type='text' value={this.state.body} size='60'
          onChange={e => this.bodyChanged(e)} /><br />
        <button onClick={e => this.post()}>発言</button>
      </div>
    )
  }
}


class BBSApp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: []
    }
  }
  // コンポーネントがマウントされたらログを読み込む
  componentWillMount () {
    this.loadLogs()
  }
  // APIにアクセスして掲示板のログ一覧を取得 --- (*4)
  loadLogs () {
    request
      .get('/api/getItems')
      .end((err, data) => {
        if (err) {
          console.error(err)
          return
        }
        this.setState({items: data.body.logs})
      })
  }
  render () {
    // 発言ログの一つずつを生成する ---- (*5)
    const itemsHtml = this.state.items.map(e => (
      <li key={e._id}>{e.name} - {e.body}</li>
    ))
    return (
      <div>
        <h1 >掲示板</h1>
        <BBSForm onPost={e => this.loadLogs()} />
        <p >
          <button onClick={e => this.loadLogs()}>
          再読込</button></p>
        <ul>{itemsHtml}</ul>
      </div>
    )
  }
}

ReactDOM.render(
  <BBSApp />,
  document.getElementById('root')
)
