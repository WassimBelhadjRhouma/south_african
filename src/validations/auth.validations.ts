import { check } from 'express-validator';

export const authValidation = {
    signup: [
        check('password').exists().withMessage({ msg: 'password required' }).isString().withMessage({ msg: 'invalid password' }).isLength({min:8, max:127}).withMessage({ msg: 'min length is 8' })
            .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/, "i").withMessage({ msg: 'password should contains at least: 1-Uppercase, 1-Lowecase, 1-Number' }),
        check('email').exists().withMessage({ msg: 'email required' }).isEmail().withMessage({ msg: 'email invalid' }),
        check('userName').exists().withMessage({ msg: 'last name required' }).isLength({ min: 3, max: 20 }).withMessage({ msg: 'invalid lastName' }),
        // check('city').exists().withMessage({ msg: 'city required' }).isLength({ min: 3, max: 20 }).withMessage({ msg: 'invalid city' }),
    ],
    signin: [
        check('email').exists().withMessage({ msg: 'email required' }).isEmail().withMessage({ msg: 'email invalid' }),
        check('password').exists().withMessage({ msg: 'password required' }).isString()
        .withMessage({ msg: 'invalid password' }).isLength({min:8, max:127})
        .withMessage({ msg: 'too short / Too long' })
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/, "i")
        .withMessage({ msg: 'password should contains at least: 1-Uppercase, 1-Lowecase, 1-Number' }),
    ],
    emailConfirmation: [
        check('emailCode').exists().withMessage({ msg: 'emailCode required' })
            .isString().withMessage({ msg: 'emailCode invalid' }),
    ],
    askResetPassword: [
        check('email').exists().withMessage({ msg: 'email required' })
            .isEmail().withMessage({ msg: 'email invalid' }),
    ],
    checkToken: [
        check('emailCode').exists().withMessage({ msg: 'emailCode required' })
            .isString().withMessage({ msg: 'emailCode invalid' }),
    ],
    resetPassword: [
        check('password').exists().withMessage({ msg: 'password should contains at least 5 carac: 1-Uppercase, 1-Lowecase, 1-Number' })
            .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/, "i").withMessage({ msg: 'password should contains at least 5 carac: 1-Uppercase, 1-Lowecase, 1-Number' }),
        check('emailCode').exists().withMessage({ msg: 'emailCode required' })
            .isString().withMessage({ msg: 'emailCode invalid' }),
    ]
};
