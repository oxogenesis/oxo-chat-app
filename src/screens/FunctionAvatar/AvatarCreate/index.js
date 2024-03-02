import React, { useState, useEffect } from 'react'
import { actionType } from '../../../redux/actions/actionType'
import { View } from 'react-native'
import { AvatarCreateNew, DeriveKeypair, DeriveAddress, MasterConfig } from '../../../lib/OXO'
import { connect } from 'react-redux'
import ButtonPrimary from '../../../component/ButtonPrimary'
import InputPrimary from '../../../component/InputPrimary'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from '../../../lib/tailwind'

//口令创建账户
const AvatarCreateScreen = (props) => {
  const [name, setName] = useState('')
  const [error_msg, setMsg] = useState('')

  const createAvatar = () => {
    if (name == '') {
      setMsg('昵称不能为空...')
      return
    }
    AvatarCreateNew(name, props.master.get('MasterKey'))
      .then(seed => {
        if (seed) {
          setMsg('')
          // setName('')
          let multi = props.master.get("Multi")
          if (multi == true) {
            // true not address
            props.navigation.goBack()
          } else {
            // false
            let keypair = DeriveKeypair(seed)
            let address = DeriveAddress(keypair.publicKey)
            MasterConfig({ multi: address })
              .then(result => {
                if (result) {
                  props.dispatch({
                    type: actionType.master.setMulti,
                    multi: address
                  })
                }
              })
            props.dispatch({
              type: actionType.avatar.enableAvatar,
              seed: seed,
              name: name
            })
          }
        }
      })
  }

  useEffect(() => {
    if (props.avatar.get('Database') != null) {
      props.navigation.replace('TabHome')
    }
  }, [props.avatar])

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto p-25px`}>
        <InputPrimary value={name} setValue={setName} placeholder={`昵称`} />

        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }

        <ButtonPrimary title={'本地生成'} onPress={createAvatar} />
      </View>
    </View>
  )

}

const ReduxAvatarCreateScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(AvatarCreateScreen)

export default ReduxAvatarCreateScreen