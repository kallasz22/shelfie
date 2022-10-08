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
    tokens: {
        type: [String]
    },
    books: {
        type: [
            {
                writer: {
                    type: String,
                    // required: true
                },
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    // required: true
                },
                type: {
                    type: String,
                    // required: true
                },
                publisher: {
                    type: String,
                    // required: true
                },
                yearOfPublication: {
                    type: Number,
                    // required: true
                },
                notes: {
                    type: String,
                    // required: true
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
    settings: {
        type: [
            {
                key: {
                    type: String,
                    required: true
                },
                value: {
                    type: String,
                    required: true
                }
            }
        ]
    }
});

module.exports = mongoose.model('user', userSchema);