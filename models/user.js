const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pkiy: {
        type: String,
        required: true
    },
    sessions: {
        /*type: [
            {
                IP: {
                    type: String
                },
                UAG: {
                    type: String
                },
                time: {
                    type: Date
                },
                UUID: {
                    type: String,
                    required: true
                }
            }
        ]*/
        type: [String]
    },
    books: {
        /*type: [
            {
                writer: {
                    type: String,
                },
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                },
                type: {
                    type: String,
                },
                publisher: {
                    type: String,
                },
                yearOfPublication: {
                    type: Number,
                },
                notes: {
                    type: String,
                },
                house: {
                    type: String,
                    required: true
                },
                room: {
                    type: String,
                    required: true
                },
                shelf: {
                    type: String,
                    required: true
                },
                pinned: {
                    type: Boolean,
                    required: true
                }
            }
        ]*/
        type: [String]
    },
    houses: {
        /*type: [
            {
                rooms: {
                    type: [
                        {
                            shelfs: {
                                type: [
                                    {
                                        name: {
                                            type: String,
                                            required: true
                                        },
                                        description: {
                                            type: String,
                                        }
                                    }
                                ],
                            },
                            name: {
                                type: String,
                                required: true
                            },
                            description: {
                                type: String,
                            }
                        }
                    ]
                },
                name: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                }
            }
        ]*/
        type: [String]
    }
});

module.exports = mongoose.model('user', userSchema);