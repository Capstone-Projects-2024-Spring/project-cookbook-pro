package com.example.cookbookpro.ui.fragmentContainers.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import com.example.cookbookpro.R
import com.example.cookbookpro.databinding.FragmentHomeBinding
import com.example.cookbookpro.signin.GoogleAuthUiClient
import com.google.android.gms.auth.api.identity.Identity

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private lateinit var googleAuthUiClient: GoogleAuthUiClient

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        googleAuthUiClient = GoogleAuthUiClient(
            context = requireContext(),
            oneTapClient = Identity.getSignInClient(requireContext())
        )
        val buttonSignOut: Button = view.findViewById(R.id.signOutButton)
        buttonSignOut.setOnClickListener{
            googleAuthUiClient.signOut()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}