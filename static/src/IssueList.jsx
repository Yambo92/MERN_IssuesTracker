import React from 'react'
import 'whatwg-fetch'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'; // ES6s
import querySearch from "stringquery";
import {Button, Icon, Collapse} from 'antd'

import IssueAdd from  "./IssueAdd.jsx";
import IssueFilter from './IssueFilter.jsx'

const { Panel } = Collapse

function IssueTable(props) {
    const issueRows = props.issues.map(issue => <IssueRow
        key={issue._id} issue={issue} deleteIssue={props.deleteIssue}
    />)
    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Effort</th>
                    <th>Completion Date</th>
                    <th>Title</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {issueRows}
            </tbody>
        </table>
    )

}

const IssueRow = (props) => {
    function onDeleteClick(){
        props.deleteIssue(props.issue._id)
    }
    return(

    <tr>
        <td><Link to={`/issues/${props.issue._id}`}>{props.issue._id.substr(-4)}</Link></td>
        <td>{props.issue.status}</td>
        <td>{props.issue.owner}</td>
        <td>{props.issue.created.toDateString()}</td>
        <td>{props.issue.effort}</td>
        <td>{props.issue.completionDate ? props.issue.completionDate.toDateString() : null}</td>
        <td>{props.issue.title}</td>
        <td>
            <Button type="primary" icon='delete' size="small" onClick={onDeleteClick}>
            </Button>
        </td>
    </tr>
)
    }

IssueRow.propTypes = {
    issue: PropTypes.shape({
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }),
    deleteIssue: PropTypes.func.isRequired
}

IssueRow.defaultProps = {
        issue: {
            title: '默认值'
        }
}


export default class IssueList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
             issues: [],
            };
        this.createIssue = this.createIssue.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.deleteIssue = this.deleteIssue.bind(this)
    }
    deleteIssue(id){
        fetch(`/api/issues/${id}`, {method: 'DELETE'}).then(response => {
            if(!response.ok) alert('Failed to delete issue')
            else this.loadData();
        })
    }
    setFilter(query){
        let search = '?'
         Object.keys(query).forEach(item => {
            let str = item + '=' + query[item];
            search += str;
        })
        this.props.history.push({pathname: this.props.location.pathname, search:search})
    }
    componentDidMount() {
        this.loadData();
    }
    componentDidUpdate(prevProps){
        const oldQuery = querySearch(prevProps.location.search);
        const newQuery = querySearch(this.props.location.search);
        if(oldQuery.status === newQuery.status 
            && oldQuery.effort_gte === newQuery.effort_gte
            && oldQuery.effort_lte === newQuery.effort_lte){
            return;
        }
        this.loadData();
    }
    loadData() {
        fetch(`/api/issues${this.props.location.search}`).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log('Total count of records:', data._metadata.total_count);
                    data.records.forEach(issue => {
                        issue.created = new Date(issue.created);
                        if (issue.completionDate) {
                            issue.completionDate = new Date(issue.completionDate)
                        }
                    });
                    this.setState({ issues: data.records });
                })
            } else {
                response.json().then(err => {
                    alert('Failed to fetch issues:' + err.message)
                })
            }
        }).catch(err => {
            alert('Error in fetching data from server:', err)
        })
    }

    createIssue(newIssue) {
        fetch('/api/issues', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(newIssue)
        }).then(response => {
            if (response.ok) {
                response.json().then(updatedIssue => {
                    updatedIssue.created = new Date(updatedIssue.created);
                    if (updatedIssue.completionDate) {
                        updatedIssue.completionDate = new Date(updatedIssue.completionDate)
                    }
                    const newIssues = this.state.issues.concat(updatedIssue);
                    this.setState({ issues: newIssues })
                })
            } else {
                response.json().then(error => {
                    alert('Failed to add issue: ' + error.message)
                })
            }
        })
            .catch(err => {
                alert('Error in sending data to server: ' + err.message)
            })
    }


    render() {
        return (
            <div>
                <Collapse >
                    <Panel header="过滤" key="1">
                    <IssueFilter setFilter={this.setFilter} initFilter={querySearch(this.props.location.search)} />
                    </Panel>
                </Collapse>
                <hr />
                <IssueTable issues={this.state.issues} deleteIssue={this.deleteIssue} />
                <hr />
                <IssueAdd createIssue={this.createIssue} />
            </div>
        )
    }
}