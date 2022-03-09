import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { path } from 'src/constants/path'
import { useAuthenticated } from 'src/hooks/useAuthenticated'
import usePopover from 'src/hooks/usePopover'
import { logout } from 'src/pages/Auth/auth.slice'
import Popover from '../Popover/Popover'
import * as S from './navbar.style'

export default function Navbar() {
  const authenticated = useAuthenticated()
  const profile = useSelector(state => state.auth.profile)
  const { activePopover, showPopover, hidePopover } = usePopover()
  const dispatch = useDispatch()

  const handleLogout = () => dispatch(logout())

  return (
    <S.Navbar>
      <S.NavMenu>
        {authenticated && (
          <li>
            <S.User onMouseEnter={showPopover} onMouseLeave={hidePopover}>
              <S.UserImage src="https://www.google.com/search?q=user+avatar&rlz=1C1PRFI_enVN972VN973&sxsrf=APq-WBvoFlvKYorpwMzIKC8jJ5JtBumBaQ:1646828003816&tbm=isch&source=iu&ictx=1&vet=1&fir=ez3Nz9AEkgf18M%252CjkSSRW6HEZViEM%252C_%253B_tfY4jaB-Ufo8M%252CwP9F87Rq1Lfk0M%252C_%253Bu50PYoIwTXl6tM%252COy32HaiPLChIlM%252C_%253BQek2uzy1aisgzM%252CHcnaCc9Adht_mM%252C_%253B-wK1cP4cfPDNnM%252CDUfNIW_ylvg4bM%252C_%253B4Ig9RcEIDaYQYM%252CPkcqcElmAb9d7M%252C_%253BOLxv-I8TX8CGlM%252CScwPCgFTL8tpXM%252C_%253BKwgKeh_0RsV5QM%252CrOW1_0j-A5xTeM%252C_%253BMhaq_vEH-kaSqM%252CP2nxXJD9TAMTyM%252C_%253BaHMJkkMhk1KwkM%252C81HvKMASMhHveM%252C_%253BXiYNiaRCjiN4zM%252CSvM6I7TQvqp7qM%252C_%253BGRYQU2zGZVgB2M%252CL_ofbOen9zYhBM%252C_%253Bwt_LC0cbs9D8HM%252CUERsyIfd_YlH2M%252C_%253BzbprPk2L7BcGGM%252C2Qe6ds1yXWPyYM%252C_%253BpXXI9aqddECyXM%252Cx-1u4Tn2Qi7T1M%252C_&usg=AI4_-kQ9TaT13_7LbFXByb_jY5W6PlVjNQ&sa=X&ved=2ahUKEwjuvLGxgLn2AhWhFbcAHY_0AWcQ9QF6BAgDEAE#imgrc=ez3Nz9AEkgf18M" />
              <S.UserName>{profile.name || profile.email}</S.UserName>
              <Popover active={activePopover}>
                <S.UserLink to={path.user}>Tài khoản của tôi</S.UserLink>
                <S.UserLink to={path.user + path.purchase}>Đơn mua</S.UserLink>
                <S.UserButton onClick={handleLogout}>Đăng xuất</S.UserButton>
              </Popover>
            </S.User>
          </li>
        )}
        {!authenticated && (
          <Fragment>
            <li>
              <S.NavLink to={path.register}>Đăng ký</S.NavLink>
            </li>
            <li>
              <S.NavLink to={path.login}>Đăng nhập</S.NavLink>
            </li>
          </Fragment>
        )}
      </S.NavMenu>
    </S.Navbar>
  )
}
