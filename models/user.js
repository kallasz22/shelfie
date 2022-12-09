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
    pkiy: { /*encrypted with password of course*/
        type: String,
        required: true
    },
    sessions: {
        type: [
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
        ]
    },
    books: {
        type: [
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
        ]
    },
    houses: {
        type: [
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
                                            // required: true
                                        }
                                    }
                                ],
                                // required: true
                            },
                            name: {
                                type: String,
                                required: true
                            },
                            description: {
                                type: String,
                                // required: true
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
                    // required: true
                }
            }
        ]
    },
    session_privacy: {
        IP: {
            type: Boolean,
            required: true
        },
        UAG: {
            type: Boolean,
            required: true
        },
        time: {
            type: Boolean,
            required: true
        }
    }
});

module.exports = mongoose.model('user', userSchema);