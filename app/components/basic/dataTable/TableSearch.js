/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import {Form} from 'semantic-ui-react';

export default class TableSearch extends Component {

    // _search(text) {
    //     console.log(this.props,this.props.data)
    //     this.props.data.items.filter(function (item) {
    //         return item.name.indexof(text) != -1
    //     })
    // }
    //
    handleSearch(e) {

        if (e.keyCode == 13){
            const keyWord = e.target.value
            this.props.onSearch(keyWord)
        }
    }

    static propTypes = {
        search: PropTypes.string.isRequired,
        onSearch: PropTypes.func.isRequired,
    };

    render() {
        return (
            <Form.Field>
                {/*<Form.Input icon="search" placeholder="Search..." onKeyDown={this.handleSearch.bind(this)}/>*/}
                <Form.Input icon="search" placeholder="Search..." value={this.props.search}
                            onKeyDown={this.handleSearch.bind(this)}/>
            </Form.Field>
        );
    }
}