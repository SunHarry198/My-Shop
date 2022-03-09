import React from 'react'
import * as S from './profile.style'
import InputText from 'src/components/InputText/InputText'
import range from 'lodash/range'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { getDate, getMonth, getYear, isExists } from 'date-fns'
import { rules } from 'src/constants/rules'
import ErrorMessage from 'src/components/ErrorMessage/ErrorMessage'
import { updateMe } from 'src/pages/Auth/auth.slice'
import { unwrapResult } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'

export default function Profile() {
  const profile = useSelector(state => state.auth.profile)
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      name: profile.name || '',
      phone: profile.phone || '',
      address: profile.address || '',
      date: profile.date_of_birth
        ? getDate(new Date(profile.date_of_birth))
        : '',
      month: profile.date_of_birth
        ? getMonth(new Date(profile.date_of_birth))
        : '',
      year: profile.date_of_birth
        ? getYear(new Date(profile.date_of_birth))
        : ''
    }
  })
  const dispatch = useDispatch()

  const update = async data => {
    const body = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      date_of_birth: new Date(data.year, data.month, data.date).toISOString()
    }
    try {
      const res = await dispatch(updateMe(body)).then(unwrapResult)
      toast.success(res.message, {
        position: 'top-center',
        autoClose: 3000
      })
    } catch (error) {
      if (error.status === 422) {
        for (const key in error.data) {
          setError(key, {
            type: 'server',
            message: error.data[key]
          })
        }
      }
    }
  }

  const validateDate = () =>
    isExists(
      Number(getValues('year')),
      Number(getValues('month')),
      Number(getValues('date'))
    ) || 'Ngày sinh không đúng'

  return (
    <S.Profile>
      <Helmet>
        <title>Hồ sơ của tôi</title>
      </Helmet>
      <S.ProfileHeader>
        <S.ProfileHeaderTitle>Hồ sơ của tôi</S.ProfileHeaderTitle>
        <S.ProfileHeaderSubtitle>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </S.ProfileHeaderSubtitle>
      </S.ProfileHeader>
      <S.ProfileInfo>
        <S.ProfileLeft onSubmit={handleSubmit(update)}>
          <S.InputLabel>
            <S.InputLabelLabel>Email</S.InputLabelLabel>
            <S.InputLabelContent>
              <S.InputLabelContentText>{profile.email}</S.InputLabelContentText>
            </S.InputLabelContent>
          </S.InputLabel>
          <S.InputLabel>
            <S.InputLabelLabel>Tên</S.InputLabelLabel>
            <S.InputLabelContent>
              <Controller
                name="name"
                control={control}
                rules={rules.name}
                render={({ field }) => (
                  <InputText
                    name="name"
                    type="text"
                    onChange={field.onChange}
                    value={getValues('name')}
                  />
                )}
              />
              <ErrorMessage name="name" errors={errors} />
            </S.InputLabelContent>
          </S.InputLabel>
          <S.InputLabel>
            <S.InputLabelLabel>Số điện thoại</S.InputLabelLabel>
            <S.InputLabelContent>
              <Controller
                name="phone"
                control={control}
                rules={rules.phone}
                render={({ field }) => (
                  <InputText
                    name="phone"
                    type="text"
                    onChange={field.onChange}
                    value={getValues('phone')}
                  />
                )}
              />
              <ErrorMessage name="phone" errors={errors} />
            </S.InputLabelContent>
          </S.InputLabel>
          <S.InputLabel>
            <S.InputLabelLabel>Địa chỉ</S.InputLabelLabel>
            <S.InputLabelContent>
              <Controller
                name="address"
                control={control}
                rules={rules.addresss}
                render={({ field }) => (
                  <InputText
                    name="address"
                    type="text"
                    onChange={field.onChange}
                    value={getValues('address')}
                  />
                )}
              />
              <ErrorMessage name="address" errors={errors} />
            </S.InputLabelContent>
          </S.InputLabel>
          <S.InputLabel>
            <S.InputLabelLabel>Ngày sinh</S.InputLabelLabel>
            <S.InputLabelContent>
              <S.DateSelect>
                <Controller
                  name="date"
                  control={control}
                  rules={{
                    validate: {
                      date: validateDate
                    }
                  }}
                  render={({ field }) => (
                    <S.SelectDate
                      title="Ngày"
                      options={range(1, 32).map(item => ({
                        name: item,
                        value: item
                      }))}
                      onChange={field.onChange}
                      value={getValues('date')}
                    />
                  )}
                />
                <Controller
                  name="month"
                  control={control}
                  rules={{
                    validate: {
                      date: validateDate
                    }
                  }}
                  render={({ field }) => (
                    <S.SelectDate
                      title="Tháng"
                      options={range(0, 12).map(item => ({
                        name: item + 1,
                        value: item
                      }))}
                      onChange={field.onChange}
                      value={getValues('month')}
                    />
                  )}
                />
                <Controller
                  name="year"
                  control={control}
                  rules={{
                    validate: {
                      date: validateDate
                    }
                  }}
                  render={({ field }) => (
                    <S.SelectDate
                      title="Năm"
                      options={range(1900, 2021).map(item => ({
                        name: item,
                        value: item
                      }))}
                      onChange={field.onChange}
                      value={getValues('year')}
                    />
                  )}
                />
              </S.DateSelect>
            </S.InputLabelContent>
            <S.ErrorMessage>
              <ErrorMessage name="date" errors={errors} />
            </S.ErrorMessage>
          </S.InputLabel>
          <S.Submit>
            <S.ButtonSubmit type="submit">Lưu</S.ButtonSubmit>
          </S.Submit>
        </S.ProfileLeft>
        <S.ProfileRight>
          <S.AvatarUploader>
            <S.Avatar>
              <img
                src="https://www.google.com/search?q=user+avatar&rlz=1C1PRFI_enVN972VN973&sxsrf=APq-WBvoFlvKYorpwMzIKC8jJ5JtBumBaQ:1646828003816&tbm=isch&source=iu&ictx=1&vet=1&fir=ez3Nz9AEkgf18M%252CjkSSRW6HEZViEM%252C_%253B_tfY4jaB-Ufo8M%252CwP9F87Rq1Lfk0M%252C_%253Bu50PYoIwTXl6tM%252COy32HaiPLChIlM%252C_%253BQek2uzy1aisgzM%252CHcnaCc9Adht_mM%252C_%253B-wK1cP4cfPDNnM%252CDUfNIW_ylvg4bM%252C_%253B4Ig9RcEIDaYQYM%252CPkcqcElmAb9d7M%252C_%253BOLxv-I8TX8CGlM%252CScwPCgFTL8tpXM%252C_%253BKwgKeh_0RsV5QM%252CrOW1_0j-A5xTeM%252C_%253BMhaq_vEH-kaSqM%252CP2nxXJD9TAMTyM%252C_%253BaHMJkkMhk1KwkM%252C81HvKMASMhHveM%252C_%253BXiYNiaRCjiN4zM%252CSvM6I7TQvqp7qM%252C_%253BGRYQU2zGZVgB2M%252CL_ofbOen9zYhBM%252C_%253Bwt_LC0cbs9D8HM%252CUERsyIfd_YlH2M%252C_%253BzbprPk2L7BcGGM%252C2Qe6ds1yXWPyYM%252C_%253BpXXI9aqddECyXM%252Cx-1u4Tn2Qi7T1M%252C_&usg=AI4_-kQ9TaT13_7LbFXByb_jY5W6PlVjNQ&sa=X&ved=2ahUKEwjuvLGxgLn2AhWhFbcAHY_0AWcQ9QF6BAgDEAE#imgrc=ez3Nz9AEkgf18M"
                alt=""
              />
            </S.Avatar>
            <S.InputFile type="file" accept=".jpg,.jpeg,.png" />
            <S.ButtonUpload light>Chọn ảnh</S.ButtonUpload>
            <S.AvatarUploaderTextContainer>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </S.AvatarUploaderTextContainer>
          </S.AvatarUploader>
        </S.ProfileRight>
      </S.ProfileInfo>
    </S.Profile>
  )
}
