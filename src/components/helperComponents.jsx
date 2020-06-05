import React, { Component } from 'react'
import { Container, Pagination } from 'semantic-ui-react'

class PaginationContainer extends Component {
    constructor(props){
        super(props)
        this.state={
            data_pag:this.props.data_pag
        }
        this.pageChange = this.pageChange.bind(this)
    }
    componentDidUpdate(prevProps){
        if(prevProps.data_pag !== this.props.data_pag){
            this.setState({data_pag:this.props.data_pag})
        }
    }
    activePage() {
        let regex = /^(.*)page=(\d*)(.*)$/
        return Number(this.state.data_pag.url.match(regex)[2])
    }
    async pageChange(e, d) {
        let regex = /page=\d+/
        let url = this.state.data_pag.url.replace(regex, `page=${d.activePage}`)
        let header = JSON.parse(sessionStorage.getItem("header"))
        let res = await fetch(url, { method: "Get", headers: header })
        let data = await res.json()
        await this.setState({data_pag: { count: data.count, url: url } })
        this.props.onPageChange(data.results)
    }
    render() {
        const {data_pag} = this.state
        return (
            <Container>
                {data_pag.count > 10 &&
                    <Container textAlign='center' style={{ padding: "20px" }}>
                        <Pagination
                            activePage={this.activePage()}
                            firstItem={null} lastItem={null}
                            totalPages={Math.ceil(data_pag.count / 10)}
                            prevItem={this.activePage() === 1 ? null : undefined}
                            nextItem={this.activePage() === Math.ceil(data_pag.count / 10) ? null : undefined}
                            onPageChange={this.pageChange}
                            showFirstAndLastNav={true}
                        />
                    </Container>
                }
            </Container>
        )
    }
}
export { PaginationContainer }