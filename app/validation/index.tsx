import * as Yup from 'yup';
export const registrationFormSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('Անունը պարտադիր է')
    .min(3, 'Անունը պետք է ունենա առնվազն 3 տառ')
    .max(16, 'Անունը չպետք է լինի ավելի քան 16 տառ'),
  lastname: Yup.string()
    .required('Ազգանունը պարտադիր է')
    .min(3, 'Ազգանունը պետք է ունենա առնվազն 3 տառ')
    .max(26, 'Ազգանունը չպետք է լինի ավելի քան 26 տառ'),
  username: Yup.string()
    .required('Մուտքանունը պարտադիր է')
    .min(8, ({ min }) => `'Մուտքանունը պետք է ունենա առնվազն ${min} տառ `)
    .max(16, ({ max }) => `Մուտքանունը չպետք է լինի ավելի քան ${max} տառ`)
    .matches(/^[a-zA-Z0-9]+$/, 'Մուտքանունը պետք է պարունակի միայն անգլերեն տառեր և թվեր'),
  phone: Yup.string()
    .required('Հեռախոսահամարը պարտադիր է')
    .min(9, 'Հեռախոսահամարը չի համապատասխանում ՀՀ ձևաչափին'),
  address: Yup.string().required('Հասցեն պարտադիր է').min(3, 'Հասցեն պետք է ունենա առնվազն 3 տառ'),
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, 'Գաղտնաբառը պետք է պարունակի փոքրատառ')
    .matches(/\w*[A-Z]\w*/, 'Գաղտնաբառը պետք է պարունակի մեծատառ')
    .matches(/\d/, 'Գաղտնաբառը պետք է պարունակի թիվ')
    .matches(/[!@#$?%^&*()\-_"=+{}; :,<.>]/, 'Գաղտնաբառը պետք է պարունակի հատուկ նշան')
    .min(8, ({ min }) => `Գաղտնաբառը պետք է լինի մեծ ${min}֊ից`)
    .max(24, ({ max }) => `Գաղտնաբառը պետք է լինի փոքր ${max}֊ից`)
    .required('Գաղտնաբառը պարտադիր է'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Գաղտնաբառերը չեն համընկնում')
    .required('Գաղտնաբառի հաստատումը պարտադիր է'),
});
export const changePasswordFormSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .matches(/\w*[a-z]\w*/, 'Հին գաղտնաբառը պետք է պարունակի փոքրատառ')
    .matches(/\w*[A-Z]\w*/, 'Հին գաղտնաբառը պետք է պարունակի մեծատառ')
    .matches(/\d/, 'Հին գաղտնաբառը պետք է պարունակի թիվ')
    .matches(/[!@#$?%^&*()\-_"=+{}; :,<.>]/, 'Հին գաղտնաբառը պետք է պարունակի հատուկ նշան')
    .min(8, ({ min }) => `Հին գաղտնաբառը պետք է լինի մեծ ${min}֊ից`)
    .required('Հին գաղտնաբառը պարտադիր է'),
  newPassword: Yup.string()
    .test(
      'not-same-as-old',
      'Նոր գաղտնաբառը չի կարող համընկնի հին գաղտնաբառի հետ',
      function (value) {
        return value !== this.parent.oldPassword;
      }
    )
    .matches(/\w*[a-z]\w*/, 'Նոր գաղտնաբառը պետք է պարունակի փոքրատառ')
    .matches(/\w*[A-Z]\w*/, 'Նոր գաղտնաբառը պետք է պարունակի մեծատառ')
    .matches(/\d/, 'Նոր գաղտնաբառը պետք է պարունակի թիվ')
    .matches(/[!@#$?%^&*()\-_"=+{}; :,<.>]/, 'Նոր գաղտնաբառը պետք է պարունակի հատուկ նշան')
    .min(8, ({ min }) => `Նոր գաղտնաբառը պետք է լինի մեծ ${min}֊ից`)
    .max(18, ({ max }) => `Նոր գաղտնաբառը պետք է լինի փոքր ${max}֊ից`)
    .required('Նոր գաղտնաբառը պարտադիր է'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Գաղտնաբառերը չեն համընկնում')
    .required('Գաղտնաբառի հաստատումը պարտադիր է'),
});
export const updateUserFormSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('Անունը պարտադիր է')
    .min(3, 'Անունը պետք է ունենա առնվազն 3 տառ')
    .max(16, 'Անունը չպետք է լինի ավելի քան 16 տառ'),
  lastname: Yup.string()
    .required('Ազգանունը պարտադիր է')
    .min(3, 'Ազգանունը պետք է ունենա առնվազն 3 տառ')
    .max(26, 'Ազգանունը չպետք է լինի ավելի քան 26 տառ'),
  username: Yup.string()
    .required('Մուտքանունը պարտադիր է')
    .min(5, 'Մուտքանունը պետք է ունենա առնվազն 5 տառ')
    .max(16, 'Մուտքանունը չպետք է լինի ավելի քան 16 տառ')
    .matches(/^[a-zA-Z0-9]+$/, 'Մուտքանունը պետք է պարունակի միայն անգլերեն տառեր և թվեր'),
  phone: Yup.string()
    .required('Հեռախոսահամարը պարտադիր է')
    .min(9, 'Հեռախոսահամարը չի համապատասխանում ՀՀ ձևաչափին'),
});

export const createAndEditCategoryFormSchema = Yup.object().shape({
  title: Yup.string()
    .required('Անվանումը պարտադիր է')
    .min(2, 'Անունը պետք է ունենա առնվազն 2 տառ')
    .max(16, 'Անունը չպետք է լինի ավելի քան 16 տառ'),
  picture: Yup.mixed().required('Նկարը պարտադիր է'),
});

export const createAndEditProductFormSchema = Yup.object().shape({
  title: Yup.string()
    .required('Անվանումը պարտադիր է')
    .min(2, 'Անունը պետք է ունենա առնվազն 2 տառ')
    .max(64, 'Անունը չպետք է լինի ավելի քան 16 տառ'),
  price: Yup.number().required('Գինը պարտադիր է').moreThan(0, 'Պետք է լինի մեծ 0֊ից'),
  count: Yup.number().required('Քանակը պարտադիր է'),
  discount: Yup.number()
    .min(0, 'Զեղչը պետք է լինի ոչ փոքր 0֊ից')
    .max(100, 'Զեղչը պետք է լինի ոչ մեծ 100֊ից'),
  code: Yup.string().required('Քանակը պարտադիր է'),
  category: Yup.string().required('Կատեգորիան պարտադիր է'),
  picture: Yup.mixed().required('Նկարը պարտադիր է'),
});

export const loginFormSchema = Yup.object().shape({
  username: Yup.string()
    .required('Մուտքանունը պարտադիր է')
    .min(5, 'Մուտքանունը պետք է ունենա առնվազն 5 տառ')
    .max(16, 'Մուտքանունը չպետք է լինի ավելի քան 16 տառ')
    .matches(/^[a-zA-Z0-9]+$/, 'Մուտքանունը պետք է պարունակի միայն անգլերեն տառեր և թվեր'),
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, 'Գաղտնաբառը պետք է պարունակի փոքրատառ')
    .matches(/\w*[A-Z]\w*/, 'Գաղտնաբառը պետք է պարունակի մեծատառ')
    .matches(/\d/, 'Գաղտնաբառը պետք է պարունակի թիվ')
    .matches(/[!@#$?%^&*()\-_"=+{}; :,<.>]/, 'Գաղտնաբառը պետք է պարունակի հատուկ նշան')
    .min(8, ({ min }) => `Գաղտնաբառը պետք է լինի մեծ ${min}֊ից`)
    .required('Գաղտնաբառը պարտադիր է'),
});
