package com.example.cookbookpro.ui.fragmentContainers.home.homeFragments.signInFragment

import android.R.attr.bitmap
import android.R.attr.src
import android.app.Activity
import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import com.example.cookbookpro.R
import com.example.cookbookpro.signin.GoogleAuthUiClient
import com.example.cookbookpro.signin.SignInResult
import com.example.cookbookpro.signin.UserData
import com.google.android.gms.auth.api.identity.Identity
import kotlinx.coroutines.launch
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL


class SignIn : Fragment() {
    companion object {
        fun newInstance() = SignIn()
        private const val REQUEST_CODE_GOOGLE_SIGN_IN = 1001
    }

    private lateinit var viewModel: SignInViewModel
    private lateinit var googleAuthUiClient: GoogleAuthUiClient

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {


        return inflater.inflate(R.layout.fragment_sign_in, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProvider(this).get(SignInViewModel::class.java)
        // TODO: Use the ViewModel
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Initialize GoogleAuthUiClient
        googleAuthUiClient = GoogleAuthUiClient(
            context = requireContext(),
            oneTapClient = Identity.getSignInClient(requireContext())
        )

        val buttonSignIn: Button = view.findViewById(R.id.signInButton)

        buttonSignIn.setOnClickListener {
            signInWithGoogle()
            var userData = googleAuthUiClient.getSignedInUser()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_CODE_GOOGLE_SIGN_IN) {
            if (resultCode == Activity.RESULT_OK) {
                lifecycleScope.launch {
                    val signInResult = googleAuthUiClient.signInWithIntent(data ?: return@launch)
                    handleSignInResult(signInResult)
                }
            }
        }
    }

    private fun handleSignInResult(signInResult: SignInResult) {
        // Handle the sign-in result
    }

    private fun signInWithGoogle() {
        lifecycleScope.launch {
            val signInIntentSender = googleAuthUiClient.signIn()
            signInIntentSender?.let {
                startIntentSenderForResult(
                    it, REQUEST_CODE_GOOGLE_SIGN_IN, null, 0, 0, 0, null
                )
            }
        }
    }
}