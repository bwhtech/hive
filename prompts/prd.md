## Intro

So basically we are building a project management solution from scratch. This will be unlike other project management solutions. And this is what we have in mind. 

The idea is to have as much involvement of the clients as we can, so we can assign client tasks too. Basically, the flow is like this: you can create projects. The clients can't create projects, so there are 2 kinds of users here: the team (the internal users) and then clients. At the global level in the settings, we can invite members (team members) and then they can be assigned to the project as well as tasks. Any point in time when there is a project, there will be. We can invite clients right? So I think clients can be global too because we can be working on multiple projects with that client, but the client will only be able to see the projects that we are working with them on. So we need some sort of many-to-many relationship here. On the client side, we will have multiple members in the client team. So I think once we have a client, and then there are team members of those clients. We need to track that. Can't be child table because I guess we'll be playing around with client-member separately. 

There will be tasks linked to the project. I think the project's landing page for a particular project will have some dashboard and then the task kanban. 

## Customer Facing Features

1. Our and customers task
2. Which project is worked by whom
3. Who is the project champion
4. Stake holders
5. For retainer they should be able to raise feature requests, we can approve or ammend (transform to task)
6. Area to post/view Minutes of Meetings for the project
7. kanban
8. Project updates
9. UAT approval for tasks
11. milestones are there however does not need to be linked with tasks
12. a field to link PR
13. Notifications

## Global Features

1. All the current projects
2. who is working on what
3. to be able to see 
4. it will have two pages/tabs (people based and project based)
5. if someone has not updated their view for more than 1 week show the red light alert maybe


## My Dashboard

* scoped to the logged in user's tasks and projects
* My list (backlog, prioritized etc)


## Assignment

1. Multiple user assignment (use Frappe's assignment feature)