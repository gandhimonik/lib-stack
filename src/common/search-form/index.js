import React, {Component} from 'react';
import { Form } from 'semantic-ui-react';

class SearchForm extends Component {
    state = {
        query: ''
    }

    onChange = e => {
        this.setState({
            query: e.target.value,
        });
    }

    render() {
        return (
            <Form onSubmit={e => this.props.onSubmit(e, this.state.query)}>
                <Form.Group>
                    <Form.Input
                    width={13}
                    size="big"
                    name="query"
                    value={this.state.query}
                    onChange={this.onChange}
                    placeholder="Search..."
                    style={{margin: '1em 0'}}
                    />
                    <Form.Button
                    fluid
                    width={3}
                    size="big"
                    color="orange"
                    type="submit"
                    style={{fontWeight: 400, margin: '1em 0'}}>
                    Search
                    </Form.Button>
                </Form.Group>
            </Form>
        );
    }
}

export default SearchForm;