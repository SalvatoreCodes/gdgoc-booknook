import { addDays } from '../utils'

export const MOCK_ACCOUNTS = [
  {
    username: 'alice',
    password: 'password123',
    displayName: 'Alice',
    initialBooks: [
      {
        instanceId: 'i_demo_1', id: 'b1', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518',
        type: 'borrowed', received: false, borrowDate: new Date().toISOString(), dueDate: addDays(new Date(), 7).toISOString()
      },
      {
        instanceId: 'i_demo_2', id: 'b16', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565',
        type: 'owned', received: true, purchasedAt: new Date().toISOString()
      }
    ]
  },
  {
    username: 'bob',
    password: 'letmein',
    displayName: 'Bob',
    initialBooks: [
      {
        instanceId: 'i_demo_3', id: 'b15', title: '1984', author: 'George Orwell', isbn: '9780451524935',
        type: 'owned', received: false, purchasedAt: new Date().toISOString()
      }
    ]
  }
]
